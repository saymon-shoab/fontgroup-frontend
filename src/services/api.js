// eslint-disable-next-line no-unused-vars
const live_url ='https://fontgroup-back.onrender.com/api/v1';
const local_url = "http://localhost:6877/api/v1"
const API_BASE_URL = local_url

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

export const createFontGroup = async (groupName,fontIds) => {
    const response = await fetch(`${API_BASE_URL}/fontGroup/create`,{
        method:"POST",
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify({groupName, fontIds})
    });
    if (!response.ok) {
        throw new Error("!Faild to create font group")
    }
    return response.json()
}

export const getFontGroups = async () => {
    const response = await fetch(`${API_BASE_URL}/fontGroup`)
    if (!response.ok) {
        throw new Error("Failed to fetch font group")
    }

    return response.json();
}

export const deleteFontGroup = async (groupId) => {
  const response = await fetch(`${API_BASE_URL}/fontGroup/${groupId}`, {
    method : "DELETE"
  });
  if (!response.ok) {
    throw new Error("Failed to delete font group");
  }

  return response.json();
}


export const updateFontGroupName = async (groupId, groupName) => {
  const response = await fetch(`${API_BASE_URL}/fontGroup/${groupId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ groupName }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update font group');
  }
  
  return response.json();
};