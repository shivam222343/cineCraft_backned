$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    email = "jaywani22@gmail.com"
    password = "JAYwani$22"
} | ConvertTo-Json

try {
    Write-Host "🔍 Testing admin login API..." -ForegroundColor Yellow
    
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Headers $headers -Body $body
    
    if ($response.success) {
        Write-Host "✅ Login successful!" -ForegroundColor Green
        Write-Host "✅ User: $($response.data.name)" -ForegroundColor Green
        Write-Host "✅ Email: $($response.data.email)" -ForegroundColor Green
        Write-Host "✅ Role: $($response.data.role)" -ForegroundColor Green
        Write-Host "✅ Token received: $($response.token -ne $null)" -ForegroundColor Green
        
        if ($response.data.role -eq "admin") {
            Write-Host "🎉 Admin access confirmed!" -ForegroundColor Cyan
        }
    } else {
        Write-Host "❌ Login failed: $($response.message)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Error testing login: $($_.Exception.Message)" -ForegroundColor Red
}
