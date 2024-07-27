import axios from 'axios';

const METAMAP_API_URL = 'https://ii.nlm.nih.gov/metamaplite/rest/annotate';
const API_KEY = 'ea95a1ba-a529-42af-a2d4-468363f4e3f7';

export const extractEntities = async (inputText) => {
  try {
    const response = await axios.post(
      METAMAP_API_URL,
      `inputtext=${encodeURIComponent(inputText)}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params: {
          apiKey: API_KEY,
        },
      }
    );

    if (response.data && Array.isArray(response.data)) {
      return response.data.map(entity => ({
        name: entity.evText,
        type: entity.semTypes[0],
        cui: entity.conceptId,
        preferredName: entity.preferredName
      }));
    } else {
      console.error('Unexpected response format:', response.data);
      throw new Error('Unexpected response format from MetaMapLite API');
    }
  } catch (error) {
    console.error('Error in extractEntities:', error);
    throw error;
  }
};