import html2canvas from 'html2canvas';

async function chartToJpegBase64(element) {
  // element can be any DOM element containing the chart
  const canvas = await html2canvas(element, {
    backgroundColor: '#ffffff',
    scale: 1, 
    logging: false,
    useCORS: true,
    allowTaint: true
  });
  
  // Convert to JPEG
  const jpegBase64 = canvas.toDataURL("image/jpeg", 0.95);
  return jpegBase64;
}

export default chartToJpegBase64;