"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Shield, AlertTriangle, Clock, Folder, File, CheckCircle, XCircle, FileWarning, RefreshCw } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { calculateFileHash, detectMalware, suspiciousExtensions } from "@/lib/antivirus"
import { Badge } from "@/components/ui/badge"

type AntivirusPanelProps = {
  isScanning: boolean
  scanProgress: number
  scanResults: {
    scannedFiles: number
    threats: number
    lastScan: string
  }
  onScan: () => void
}

interface ScanResult {
  fileName: string
  filePath: string
  fileSize: string
  hash: string
  isSafe: boolean
  detectionMethod?: string
  details?: string
  timestamp: string
}

export default function AntivirusPanel({
  isScanning: globalIsScanning,
  scanProgress: globalScanProgress,
  scanResults: globalScanResults,
  onScan: globalOnScan,
}: AntivirusPanelProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileHash, setFileHash] = useState<string | null>(null)
  const [isSafe, setIsSafe] = useState<boolean | null>(null)
  const [detectionDetails, setDetectionDetails] = useState<{ method: string; details: string } | null>(null)

  // For real file scanning
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [scanResults, setScanResults] = useState<ScanResult[]>([])
  const [threatCount, setThreatCount] = useState(0)
  const [totalScanned, setTotalScanned] = useState(0)
  const [scanningStatus, setScanningStatus] = useState<"idle" | "scanning" | "complete">("idle")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const folderInputRef = useRef<HTMLInputElement>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setFileHash(null)
      setIsSafe(null)
      setDetectionDetails(null)

      try {
        // Calculate hash
        const hashHex = await calculateFileHash(file)
        setFileHash(hashHex)

        // Enhanced malware detection
        const detectionResult = await detectMalware(file)
        setIsSafe(detectionResult.isSafe)
        setDetectionDetails({
          method: detectionResult.detectionMethod,
          details: detectionResult.details,
        })
      } catch (error) {
        console.error("Error analyzing file:", error)
        setErrorMessage(`Error analyzing file: ${error instanceof Error ? error.message : String(error)}`)
      }
    }
  }

  const handleFilesForScanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files)
      setErrorMessage(null)
    }
  }

  // Validate files before scanning
  const validateFiles = (files: FileList | null): boolean => {
    if (!files || files.length === 0) {
      return false
    }

    // Check if we can access at least some of the files
    let accessibleFiles = 0
    for (let i = 0; i < files.length; i++) {
      if (files[i] && files[i].size !== undefined) {
        accessibleFiles++
      }
    }

    return accessibleFiles > 0
  }

  const startFileScan = async () => {
    if (!validateFiles(selectedFiles)) {
      setErrorMessage("No valid files selected for scanning")
      return
    }

    if (!selectedFiles || selectedFiles.length === 0) return

    setIsScanning(true)
    setScanningStatus("scanning")
    setScanProgress(0)
    setScanResults([])
    setThreatCount(0)
    setTotalScanned(0)
    setErrorMessage(null)

    const totalFiles = selectedFiles.length
    let processedFiles = 0
    let threats = 0
    const results: ScanResult[] = []

    for (let i = 0; i < totalFiles; i++) {
      const file = selectedFiles[i]

      try {
        // Verify file is accessible before processing
        if (!file || file.size === undefined) {
          console.warn(`Skipping inaccessible file at index ${i}`)
          continue
        }

        // Enhanced malware detection
        const detectionResult = await detectMalware(file)
        const isSafe = detectionResult.isSafe

        if (!isSafe) threats++

        // Add to results
        results.push({
          fileName: file.name,
          filePath: file.webkitRelativePath || "Selected file",
          fileSize: formatFileSize(file.size),
          hash: await calculateFileHash(file),
          isSafe: isSafe,
          detectionMethod: detectionResult.detectionMethod,
          details: detectionResult.details,
          timestamp: new Date().toLocaleString(),
        })

        processedFiles++
        setTotalScanned(processedFiles)
        setThreatCount(threats)
        setScanProgress(Math.floor((processedFiles / totalFiles) * 100))

        // Update results as we go
        setScanResults([...results])

        // Small delay to not freeze the UI
        await new Promise((resolve) => setTimeout(resolve, 50))
      } catch (error) {
        console.error(
          `Error scanning file ${file?.name || "unknown"}: ${error instanceof Error ? error.message : String(error)}`,
        )

        // Add to results as an error
        results.push({
          fileName: file?.name || "Unknown file",
          filePath: file?.webkitRelativePath || "Error accessing file",
          fileSize: file?.size ? formatFileSize(file.size) : "Unknown",
          hash: "Error - Could not calculate hash",
          isSafe: false, // Mark as potentially unsafe since we couldn't verify
          detectionMethod: "Error",
          details: `Error scanning file: ${error instanceof Error ? error.message : String(error)}`,
          timestamp: new Date().toLocaleString(),
        })

        processedFiles++
        setTotalScanned(processedFiles)
        setScanProgress(Math.floor((processedFiles / totalFiles) * 100))

        // Update results as we go
        setScanResults([...results])

        // Continue with next file
        await new Promise((resolve) => setTimeout(resolve, 50))
      }
    }

    setIsScanning(false)
    setScanningStatus("complete")
    setScanProgress(100)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB"
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + " MB"
    else return (bytes / 1073741824).toFixed(2) + " GB"
  }

  const selectFiles = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }, [])

  const selectFolder = useCallback(() => {
    if (folderInputRef.current) {
      folderInputRef.current.click()
    }
  }, [])

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center space-x-2">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-semibold">Antivirus</h1>
      </div>

      <Tabs defaultValue="scan" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-12">
          <TabsTrigger value="scan" className="rounded-lg">
            Scan
          </TabsTrigger>
          <TabsTrigger value="file-check" className="rounded-lg">
            File Check
          </TabsTrigger>
          <TabsTrigger value="history" className="rounded-lg">
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scan" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>File Scanner</CardTitle>
              <CardDescription>Scan files or folders for malware using multiple detection methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={selectFiles}
                  variant="outline"
                  className="h-32 flex flex-col items-center justify-center border-dashed"
                  disabled={isScanning}
                >
                  <File className="h-10 w-10 mb-3 text-primary/60" />
                  <span className="font-medium">Select Files</span>
                  <span className="text-xs text-muted-foreground mt-1">Choose individual files to scan</span>
                </Button>

                <Button
                  onClick={selectFolder}
                  variant="outline"
                  className="h-32 flex flex-col items-center justify-center border-dashed"
                  disabled={isScanning}
                >
                  <Folder className="h-10 w-10 mb-3 text-primary/60" />
                  <span className="font-medium">Select Folder</span>
                  <span className="text-xs text-muted-foreground mt-1">Scan an entire folder at once</span>
                </Button>

                <input type="file" ref={fileInputRef} onChange={handleFilesForScanChange} className="hidden" multiple />

                <input
                  type="file"
                  ref={folderInputRef}
                  onChange={handleFilesForScanChange}
                  className="hidden"
                  webkitdirectory=""
                  directory=""
                />
              </div>

              {selectedFiles && selectedFiles.length > 0 && (
                <div className="bg-secondary rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium">Selected {selectedFiles.length} files for scanning</p>
                    <p className="text-sm text-muted-foreground">Ready to scan for threats</p>
                  </div>
                  <Button onClick={startFileScan} disabled={isScanning} size="sm">
                    {isScanning ? "Scanning..." : "Start Scan"}
                  </Button>
                </div>
              )}

              {errorMessage && (
                <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              {isScanning && (
                <div className="space-y-3 bg-secondary/50 p-4 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>
                      Scanning... ({totalScanned}/{selectedFiles?.length})
                    </span>
                    <span>{scanProgress}%</span>
                  </div>
                  <Progress value={scanProgress} className="h-2" />
                </div>
              )}

              {scanningStatus === "complete" && (
                <Alert
                  variant={threatCount > 0 ? "destructive" : "default"}
                  className={
                    threatCount > 0
                      ? "bg-destructive/10 text-destructive border-destructive/20"
                      : "bg-success/10 text-success border-success/20"
                  }
                >
                  <AlertTitle className="flex items-center">
                    {threatCount > 0 ? (
                      <>
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Threats Detected!
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 mr-2" />
                        All Files Clean
                      </>
                    )}
                  </AlertTitle>
                  <AlertDescription>
                    Scanned {totalScanned} files | Found {threatCount} threats
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={startFileScan}
                disabled={isScanning || !selectedFiles || selectedFiles.length === 0}
                className="w-full"
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  "Start Scan"
                )}
              </Button>
            </CardFooter>
          </Card>

          {scanResults.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Scan Results</CardTitle>
                <CardDescription>Detailed results of your file scan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">File</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Size</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                          Detection Method
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {scanResults.map((result, index) => (
                        <tr key={index} className={result.isSafe ? "" : "bg-destructive/5"}>
                          <td className="px-4 py-3 text-sm">
                            <div className="font-medium">{result.fileName}</div>
                            <div className="text-xs text-muted-foreground">{result.filePath}</div>
                            {result.details && !result.isSafe && (
                              <div className="text-xs text-destructive mt-1">{result.details}</div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">{result.fileSize}</td>
                          <td className="px-4 py-3 text-sm">
                            {result.isSafe ? (
                              <Badge
                                variant="outline"
                                className="bg-success/10 text-success border-success/20 flex items-center space-x-1"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Safe
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-destructive/10 text-destructive border-destructive/20 flex items-center space-x-1"
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Threat
                              </Badge>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm">{result.detectionMethod || "Hash Analysis"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="file-check" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>File Analyzer</CardTitle>
              <CardDescription>Check individual files using multiple detection methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="file-upload">Select a file to analyze</Label>
                <Input id="file-upload" type="file" onChange={handleFileChange} className="cursor-pointer" />
              </div>

              {selectedFile && (
                <div className="space-y-4 p-4 bg-secondary rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-background rounded-lg">
                      <FileWarning className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(selectedFile.size)} • {selectedFile.type || "Unknown type"}
                      </p>
                    </div>
                  </div>

                  {fileHash && (
                    <>
                      <div>
                        <p className="text-sm font-medium mb-1">SHA-256 Hash:</p>
                        <p className="text-xs bg-background p-3 rounded-lg font-mono break-all">{fileHash}</p>
                      </div>

                      {isSafe !== null && (
                        <Alert
                          variant={isSafe ? "default" : "destructive"}
                          className={
                            isSafe
                              ? "bg-success/10 text-success border-success/20"
                              : "bg-destructive/10 text-destructive border-destructive/20"
                          }
                        >
                          <AlertTitle className="flex items-center">
                            {isSafe ? (
                              <>
                                <Shield className="h-4 w-4 mr-2" />
                                File is safe
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Potential threat detected!
                              </>
                            )}
                          </AlertTitle>
                          <AlertDescription>
                            {detectionDetails ? (
                              <div className="space-y-1">
                                <p>
                                  <strong>Detection Method:</strong> {detectionDetails.method}
                                </p>
                                <p>
                                  <strong>Details:</strong> {detectionDetails.details}
                                </p>
                              </div>
                            ) : isSafe ? (
                              "This file doesn't match any known malware signatures."
                            ) : (
                              "This file matches a known malware signature. Handle with caution!"
                            )}
                          </AlertDescription>
                        </Alert>
                      )}
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detection Methods</CardTitle>
              <CardDescription>NoVirus uses multiple methods to detect malware</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center">
                    <FileWarning className="h-4 w-4 mr-2 text-primary" />
                    Hash Analysis
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Compares file hashes against a database of known malware signatures.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium flex items-center">
                    <FileWarning className="h-4 w-4 mr-2 text-primary" />
                    Extension Analysis
                  </h3>
                  <p className="text-sm text-muted-foreground">Identifies potentially dangerous file extensions.</p>
                  <div className="mt-2 bg-secondary/70 p-2 rounded-lg">
                    <p className="text-xs font-medium mb-1">Suspicious extensions include:</p>
                    <div className="flex flex-wrap gap-1">
                      {suspiciousExtensions.slice(0, 15).map((ext, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-background">
                          {ext}
                        </Badge>
                      ))}
                      <Badge variant="outline" className="text-xs bg-background">
                        and more...
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium flex items-center">
                    <FileWarning className="h-4 w-4 mr-2 text-primary" />
                    Pattern Analysis
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Scans file contents for suspicious code patterns and commands.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium flex items-center">
                    <FileWarning className="h-4 w-4 mr-2 text-primary" />
                    Size Analysis
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Identifies suspiciously small executable files that may be malicious.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scan History</CardTitle>
              <CardDescription>View your recent scan history and results</CardDescription>
            </CardHeader>
            <CardContent>
              {scanResults.length === 0 && globalScanResults.lastScan === "Never" ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No scan history available</p>
                  <p className="text-sm">Run your first scan to see results here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-secondary">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date & Time</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                            Files Scanned
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Threats</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {scanResults.length > 0 && (
                          <tr>
                            <td className="px-4 py-3 text-sm">{new Date().toLocaleString()}</td>
                            <td className="px-4 py-3 text-sm">File Scan</td>
                            <td className="px-4 py-3 text-sm">{totalScanned}</td>
                            <td className="px-4 py-3 text-sm">
                              <Badge
                                variant="outline"
                                className={
                                  threatCount > 0
                                    ? "bg-destructive/10 text-destructive border-destructive/20"
                                    : "bg-success/10 text-success border-success/20"
                                }
                              >
                                {threatCount}
                              </Badge>
                            </td>
                          </tr>
                        )}

                        {globalScanResults.lastScan !== "Never" && (
                          <tr>
                            <td className="px-4 py-3 text-sm">{globalScanResults.lastScan}</td>
                            <td className="px-4 py-3 text-sm">Quick Scan</td>
                            <td className="px-4 py-3 text-sm">{globalScanResults.scannedFiles}</td>
                            <td className="px-4 py-3 text-sm">
                              <Badge
                                variant="outline"
                                className={
                                  globalScanResults.threats > 0
                                    ? "bg-destructive/10 text-destructive border-destructive/20"
                                    : "bg-success/10 text-success border-success/20"
                                }
                              >
                                {globalScanResults.threats}
                              </Badge>
                            </td>
                          </tr>
                        )}

                        {/* Simulated history entries */}
                        <tr>
                          <td className="px-4 py-3 text-sm">4/3/2025, 10:15:22 AM</td>
                          <td className="px-4 py-3 text-sm">Full 10:15:22 AM</td>
                          <td className="px-4 py-3 text-sm">Full Scan</td>
                          <td className="px-4 py-3 text-sm">1,245</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                              0
                            </Badge>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm">4/1/2025, 9:30:05 AM</td>
                          <td className="px-4 py-3 text-sm">Quick Scan</td>
                          <td className="px-4 py-3 text-sm">532</td>
                          <td className="px-4 py-3 text-sm">
                            <Badge
                              variant="outline"
                              className="bg-destructive/10 text-destructive border-destructive/20"
                            >
                              1
                            </Badge>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
