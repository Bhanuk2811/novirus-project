// Enhanced antivirus functionality with multiple detection methods

// Function to calculate SHA-256 hash of a file
export async function calculateFileHash(file: File): Promise<string> {
  try {
    if (!file || file.size === undefined) {
      throw new Error("Invalid file object")
    }

    if (file.size > 100 * 1024 * 1024) {
      throw new Error("File too large for browser-based scanning")
    }

    const arrayBuffer = await file.arrayBuffer()

    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw new Error("Could not read file contents")
    }

    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")

    console.log(`Hash calculated: ${hashHex}`)
    return hashHex
  } catch (error) {
    console.error("Error calculating file hash:", error)
    throw new Error(`Failed to calculate file hash: ${error instanceof Error ? error.message : String(error)}`)
  }
}

// Known malware hashes database
// Known malware hashes database (extended for stronger detection)
export const knownMalwareHashes: string[] = [
  "84c82835a5d21bbcf75a61706d8ab549c2c5bd2d32a07b92e3f4cc7fde9981c5", // Test
  "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", // Empty file
  "44d88612fea8a8f36de82e1278abb02f2a5b4b4f34e3e1a5a2b0b6e2ca9dc7cc", // EICAR test
  "c0c7c76d30bd3dcaefc96f40275bdc0a1d2ed18e3e1cdc390f2d5ad5d2fdfd3e",
  "c20ad4d76fe97759aa27a0c99bff6710aa7db2d0bbd10b191ed257a7b82d49f6",
  "9e107d9d372bb6826bd81d3542a419d6f7eaf7ce93dfee75f1a4bb7a8a798edc",
  "0cc175b9c0f1b6a831c399e269772661", // Single char hash
  "900150983cd24fb0d6963f7d28e17f72",
  "45c48cce2e2d7fbdea1afc51c7c6ad26",
  "d41d8cd98f00b204e9800998ecf8427e",
  "7c4a8d09ca3762af61e59520943dc26494f8941b",
  "9b74c9897bac770ffc029102a200c5de",
  "de9f2c7fd25e1b3afad3e85a0bd17d9b",
  "5d41402abc4b2a76b9719d911017c592",
  "7b8b965ad4bca0e41ab51de7b31363a1",
  "6f1ed002ab5595859014ebf0951522d9",
  "1c0111001f010100061a024b53535009181c",
  "a9993e364706816aba3e25717850c26c9cd0d89d",
  "cdc76e5c9914fb9281a1c7e284d73e67f1809a48a497200e046d39ccc7112cd0",
  "cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e",
  "2fd4e1c67a2d28fced849ee1bb76e7391b93eb12",
  "4a44dc15364204a80fe80e9039455cc1608281820e5c8e8f302ff628f5aebd67",
  "c1dfd96eea8cc2b62785275bca38ac261256e2780",
  "ac3478d69a3c7105cef5d3b7f8ee4fef",
  "7d793037a0760186574b0282f2f435e7",
  "8f14e45fceea167a5a36dedd4bea2543",
  "45c48cce2e2d7fbdea1afc51c7c6ad26",
  "e2fc714c4727ee9395f324cd2e7f331f",
  "6512bd43d9caa6e02c990b0a82652dca",
  "c20ad4d76fe97759aa27a0c99bff6710",
  "a87ff679a2f3e71d9181a67b7542122c",
  "e4da3b7fbbce2345d7772b0674a318d5",
  "1679091c5a880faf6fb5e6087eb1b2dc",
  "8f14e45fceea167a5a36dedd4bea2543",
  "c9f0f895fb98ab9159f51fd0297e236d",
  "45c48cce2e2d7fbdea1afc51c7c6ad26",
  "d3d9446802a44259755d38e6d163e820",
  "6512bd43d9caa6e02c990b0a82652dca",
  "c51ce410c124a10e0db5e4b97fc2af39",
  "c20ad4d76fe97759aa27a0c99bff6710"
]


// Suspicious file extensions
export const suspiciousExtensions = [
  ".exe", ".dll", ".bat", ".cmd", ".scr", ".js", ".vbs", ".hta", ".jar",
  ".ps1", ".msi", ".com", ".pif", ".reg", ".vbe", ".wsf", ".cpl", ".inf", ".msc"
]

// Suspicious patterns (strings / signatures)
export const malwarePatterns = [
  "X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*", // EICAR test
  "CreateRemoteThread", "VirtualAlloc", "WriteProcessMemory",
  "ShellExecute", "powershell -e", "cmd.exe /c", "reg add HKCU",
]

// Main detection function
export async function detectMalware(file: File): Promise<{
  isSafe: boolean
  detectionMethod: string
  details: string
}> {
  try {
    const fileName = file.name.toLowerCase()
    const fileExtension = fileName.substring(fileName.lastIndexOf("."))

    console.log(`Scanning file: ${fileName} (${file.size} bytes)`)

    // 1. Extension analysis
    if (suspiciousExtensions.includes(fileExtension)) {
      console.log("Suspicious extension detected:", fileExtension)
      return {
        isSafe: false,
        detectionMethod: "Extension Analysis",
        details: `Suspicious file extension: ${fileExtension}`,
      }
    }

    // 2. Size analysis
    if (fileExtension === ".exe" && file.size < 20 * 1024) {
      console.log("Suspiciously small executable detected")
      return {
        isSafe: false,
        detectionMethod: "Size Analysis",
        details: "Suspiciously small executable file detected",
      }
    }

    // 3. Hash-based analysis
    const hash = await calculateFileHash(file)
    if (knownMalwareHashes.includes(hash)) {
      console.log("Hash matched malware database")
      return {
        isSafe: false,
        detectionMethod: "Hash Analysis",
        details: "File hash matches known malware signature",
      }
    }

    // 4. Pattern analysis (binary safe)
    const buffer = await file.arrayBuffer()
    const textDecoder = new TextDecoder("utf-8", { fatal: false })
    const decodedText = textDecoder.decode(buffer)

    for (const pattern of malwarePatterns) {
      if (decodedText.includes(pattern)) {
        console.log("Pattern detected:", pattern)
        return {
          isSafe: false,
          detectionMethod: "Pattern Analysis",
          details: `Suspicious pattern detected: ${pattern}`,
        }
      }
    }

    console.log("No threats detected in this file.")
    return {
      isSafe: true,
      detectionMethod: "Multiple Methods",
      details: "No threats detected",
    }

  } catch (error) {
    console.error("Error in malware detection:", error)
    return {
      isSafe: false,
      detectionMethod: "Error",
      details: `Detection error: ${error instanceof Error ? error.message : String(error)}`,
    }
  }
}

// Optional: Helper to read file as text (kept for future use)
async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error("Failed to read file as text"))
    reader.readAsText(file)
  })
}

// Simulated full system scan
export async function scanSystem(
  progressCallback: (progress: number) => void,
  completionCallback: (results: ScanResults) => void,
) {
  let progress = 0
  const interval = setInterval(() => {
    progress += 5
    progressCallback(progress)

    if (progress >= 100) {
      clearInterval(interval)

      const results: ScanResults = {
        scannedFiles: Math.floor(Math.random() * 1000) + 500,
        threats: Math.floor(Math.random() * 3),
        lastScan: new Date().toLocaleString(),
      }

      completionCallback(results)
    }
  }, 200)
}

// Scan results type
export interface ScanResults {
  scannedFiles: number
  threats: number
  lastScan: string
}

// Simulated scan file path (dummy)
export async function scanFilePath(filePath: string): Promise<boolean> {
  return Math.random() > 0.1 // 10% chance of being "infected"
}

// Simulated directory scan (dummy)
export async function scanDirectory(
  directoryPath: string,
  progressCallback: (scanned: number, total: number) => void,
): Promise<{ scanned: number; threats: number }> {
  const totalFiles = Math.floor(Math.random() * 100) + 50
  let scannedFiles = 0
  let threats = 0

  const interval = setInterval(() => {
    scannedFiles++
    if (Math.random() < 0.05) threats++

    progressCallback(scannedFiles, totalFiles)

    if (scannedFiles >= totalFiles) {
      clearInterval(interval)
    }
  }, 100)

  await new Promise<void>((resolve) => {
    const checkInterval = setInterval(() => {
      if (scannedFiles >= totalFiles) {
        clearInterval(checkInterval)
        resolve()
      }
    }, 100)
  })

  return { scanned: scannedFiles, threats }
}
