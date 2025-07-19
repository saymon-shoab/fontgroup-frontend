const API_BASE_URL = 'https://fontgroup-back.onrender.com/api/v1';

export const uploadFont = async(fontFile) => {
   const formData = new FormData();
   formData.append('font', fontFile)

   const response = await fetch(`${API_BASE_URL}/fonts/upload`, {
    method: "POST",
    body: formData
   });
     
  if (!response.ok) {
    throw new Error('Failed to upload font');
  }
  
  return response.json();
}

export const getFonts = async () => {
  const response = await fetch(`${API_BASE_URL}/fonts`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch fonts');
  }
  
  return response.json();
};