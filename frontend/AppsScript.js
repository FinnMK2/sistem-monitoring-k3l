function doPost(e) {
  try {
    var params = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet(); // Membaca sheet aktif saat ini
    
    var noKegiatan = params.no_kegiatan; // Contoh: "1.2.B"
    var minggu = params.minggu;          // Contoh: 5
    var nilaiAktual = params.nilai_aktual; // Contoh: 3
    
    var data = sheet.getDataRange().getValues();
    
    // Cari baris kegiatan berdasarkan kolom nomor "No" (di kolom E / indeks 4)
    for (var i = 0; i < data.length; i++) {
      if (data[i][4] == noKegiatan) {
        // Tentukan baris Actual (biasanya tepat di bawah baris Plan, yaitu i + 1)
        var targetRow = i;
        if (data[i][10] == "Actual" || data[i+1][10] == "Actual") {
          targetRow = (data[i][10] == "Actual") ? i : i + 1;
        }
        
        // Kolom M-1 berada di kolom K (indeks 10). M-w terletak di indeks (10 + w - 1)
        var colIndex = 10 + (minggu - 1); 
        
        // Tulis nilai baru ke dalam sel Google Sheets secara real-time
        sheet.getRange(targetRow + 1, colIndex + 1).setValue(nilaiAktual);
        
        return ContentService.createTextOutput(JSON.stringify({
          "status": "success",
          "message": "Data berhasil diperbarui di Google Sheets!"
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      "status": "error",
      "message": "Nomor kegiatan '" + noKegiatan + "' tidak ditemukan."
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      "status": "error",
      "message": err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}