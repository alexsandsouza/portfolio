$pdfFolder = "c:\Users\alexs\OneDrive\Documentos\Alexsander_Farias\portfolio\public\poo"
$pdfs = @(
    "$pdfFolder\01-introducao-a-programacao-orientada-a-objetos-PROGRAMACAO-ORIENTADA-A-OBJETOS-IMD.pdf",
    "$pdfFolder\02-classes-atributos-e-metodos-PROGRAMACAO-ORIENTADA-A-OBJETOS-IMD.pdf",
    "$pdfFolder\03-objetos-construtores-PROGRAMACAO-ORIENTADA-A-OBJETOS-IMD.pdf"
)

foreach ($pdf in $pdfs) {
    Write-Host "=== $([System.IO.Path]::GetFileName($pdf)) ===" -ForegroundColor Cyan
    $bytes = [System.IO.File]::ReadAllBytes($pdf)
    $text = [System.Text.Encoding]::Latin1.GetString($bytes)
    $matches = [regex]::Matches($text, '\(([^\)]{3,100})\) Tj')
    $out = ""
    foreach ($m in $matches) {
        $out += $m.Groups[1].Value + " "
    }
    if ($out.Length -gt 5000) { $out = $out.Substring(0, 5000) }
    Write-Host $out
    Write-Host ""
}
