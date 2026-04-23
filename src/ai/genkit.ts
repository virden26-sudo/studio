import {genkit} from 'genkit';
import {ollama} from 'genkitx-ollama';

export const ai = genkit({
  plugins: [
    ollama({
      models: [{name: 'budd-ie:latest'}],
      serverAddress: 'http://127.0.0.1:11434', // Default Ollama address
    }),
  ],
  model: 'ollama/budd-ie:latest',
});
