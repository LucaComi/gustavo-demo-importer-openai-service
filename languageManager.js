export const getLanguage = (languageCode) => {
    switch (languageCode) {
        case "EN": 
            return "English";
        case "IT": 
            return "Italian";
        case "DE": 
            return "German";
        default:
            return "English";
    }
}