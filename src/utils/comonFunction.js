export const getCleanFontName = (fileName) => {
    if (!fileName) return "";
    return fileName
    .replace(/\.ttf$/i, '')  
    .replace(/[,_-]+/g, ' ')      
    .replace(/\s+/g, ' ')  
    .replace(/[,]/g, " ")      
    .trim();  
  };