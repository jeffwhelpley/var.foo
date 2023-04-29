
class KbDbAdapter {
    env: any;

    private getNamespace(kvdbName: string): KVNamespace {
        const namespace: KVNamespace = this.env[kvdbName];
        if (!namespace) {
            throw new Error('Invalid database namespace: ' + kvdbName);
        }
        return namespace;
    }

    public registerEnv(env: any) {
        this.env = env;
    }

    public async saveValue<T>(kvdbName: string, key: string, value: T) {
        const namespace = this.getNamespace(kvdbName);

        let valueAsString: string;
        if (value && typeof value === 'object') {
            valueAsString = JSON.stringify(value);
        } else if (value) {
            valueAsString = value + '';
        } else {
            valueAsString = value as string;
        }

        return namespace.put(key, valueAsString);
    }

    public async getValue<T>(kvdbName: string, key: string): Promise<T> {
        const namespace = this.getNamespace(kvdbName);
        const valueAsString = await namespace.get(key);
        const firstChar = valueAsString?.trim().charAt(0);

        if (valueAsString && (firstChar === '{' || firstChar === '[')) {
            return JSON.parse(valueAsString) as T;
        } else {
            return valueAsString as T;
        }
    }
}

export const kvdb = new KbDbAdapter();
