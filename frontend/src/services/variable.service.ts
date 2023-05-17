import { api } from '../adapters';
import type { Variable } from '../models';

class VariableService {
    name = 'variables';

    async setVariableFiles(visitorId: string, files: File[]): Promise<Variable> {
        const formData = new FormData();

        formData.append('visitorId', visitorId || '');
        for (const file of files) {
            // if file greater than 10MB, don't upload 981767724
            if (file.size > 10000000) {
                window.alert('File too large. Max size is 10MB.');
                throw new Error('File too large. Max size is 10MB.');
            }

            formData.append('files', file);
        }

        return api.post<Variable>(this.name, 'setVariableFiles', formData);
    }
}

export const variableService = new VariableService();
