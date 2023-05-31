import { api } from '../adapters';
import type { Visitor } from '../models';

class VisitorService {
    name = 'visitors';

    async createVisitor(): Promise<Visitor> {
        return api.post<Visitor>(this.name, 'createVisitor');
    }
}

export const visitorService = new VisitorService();
