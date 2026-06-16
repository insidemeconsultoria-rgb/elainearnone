/**
 * GOOGLE APPS SCRIPT — Quiz Elaine Arnone
 * =========================================
 * Cole este código no Apps Script da sua planilha Google Sheets
 * e faça o deploy como "Web App" (qualquer pessoa pode acessar).
 *
 * A planilha receberá automaticamente os dados de cada resposta do quiz.
 */

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Cabeçalhos — criados apenas se a planilha estiver vazia
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Data/Hora',
        'Nome',
        'WhatsApp',
        'Instagram',
        'P1', 'P2', 'P3', 'P4',
        'P5', 'P6', 'P7', 'P8',
        'Estilo',
        'Oferta Direcionada',
      ]);

      // Formata cabeçalhos
      const header = sheet.getRange(1, 1, 1, 14);
      header.setBackground('#C8A46A');
      header.setFontColor('#000000');
      header.setFontWeight('bold');
      header.setFontSize(11);
      sheet.setFrozenRows(1);
    }

    // Parse dos dados recebidos
    const data = JSON.parse(e.postData.contents);

    // Formata data para o fuso horário de São Paulo
    const ts = new Date(data.timestamp);
    const formatted = Utilities.formatDate(ts, 'America/Sao_Paulo', 'dd/MM/yyyy HH:mm:ss');

    // Insere nova linha
    sheet.appendRow([
      formatted,
      data.nome       || '',
      data.whatsapp   || '',
      data.instagram  || '',
      data.p1 || '', data.p2 || '', data.p3 || '', data.p4 || '',
      data.p5 || '', data.p6 || '', data.p7 || '', data.p8 || '',
      data.estilo     || '',
      data.oferta     || '',
    ]);

    // Auto-ajusta largura das colunas
    sheet.autoResizeColumns(1, 14);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Função de teste — rode no editor para verificar se está funcionando
function testar() {
  const fakeEvent = {
    postData: {
      contents: JSON.stringify({
        timestamp:  new Date().toISOString(),
        nome:       'Teste Silva',
        whatsapp:   '(11) 99999-9999',
        instagram:  '@teste',
        p1: 'A', p2: 'C', p3: 'F', p4: 'A',
        p5: 'B', p6: 'C', p7: 'D', p8: 'C',
        estilo:     'Clássico',
        oferta:     'Consultoria',
      })
    }
  };
  const result = doPost(fakeEvent);
  Logger.log(result.getContent());
}
