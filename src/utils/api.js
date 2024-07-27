import axios from 'axios';

const METAMAP_API_URL = 'https://ii.nlm.nih.gov/metamaplite/rest/annotate';
const UMLS_API_URL = 'https://uts-ws.nlm.nih.gov/rest';
const API_KEY = 'ea95a1ba-a529-42af-a2d4-468363f4e3f7';

export const extractEntities = async (inputText) => {
  try {
    // Step 1: Call MetaMapLite API
    const metamapResponse = await axios.post(METAMAP_API_URL, {
      inputtext: inputText,
      docformat: 'freetext',
      resultformat: 'json',
      apiKey: API_KEY
    });

    // Step 2: Process MetaMapLite response and extract CUIs
    const entities = metamapResponse.data.map(entity => ({
      name: entity.matchedtext,
      type: entity.evlist[0].conceptinfo.semantictypes[0],
      cui: entity.evlist[0].conceptinfo.cui
    }));

    // Step 3: Enrich entities with UMLS data
    const enrichedEntities = await Promise.all(entities.map(async (entity) => {
      try {
        const umlsResponse = await axios.get(`${UMLS_API_URL}/content/current/CUI/${entity.cui}`, {
          params: { apiKey: API_KEY }
        });
        return {
          ...entity,
          preferredName: umlsResponse.data.result.name
        };
      } catch (error) {
        console.error(`Error fetching UMLS data for CUI ${entity.cui}:`, error);
        return entity;
      }
    }));

    return enrichedEntities;
  } catch (error) {
    console.error('Error in extractEntities:', error);
    throw error;
  }
};