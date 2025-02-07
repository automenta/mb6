import { useState, useEffect } from 'react';
import { useYDoc } from '../core/YObject';
import { TagRegistry } from '../core/TagRegistry';

export default function SchemaEditor() {
    const { yDoc } = useYDoc();
    const [schemas, setSchemas] = useState([]);
    const [selectedSchema, setSelectedSchema] = useState(null);

    useEffect(() => {
        setSchemas(TagRegistry.getAllSchemas());
    }, []);

    const saveSchema = () => {
        if (selectedSchema) {
            TagRegistry.updateSchema(selectedSchema);
        } else {
            TagRegistry.addSchema({
                ...schemaData,
                id: Date.now().toString()
            });
        }
        setSelectedSchema(null);
    };

    return (
        <div className="schema-editor">
            <h2>Schema Editor</h2>
            <div className="schema-list">
                {schemas.map(schema => (
                    <div key={schema.id} className="schema-item">
                        <h3>{schema.name}</h3>
                        <button onClick={() => setSelectedSchema(schema)}>Edit</button>
                    </div>
                ))}
            </div>
            {selectedSchema && (
                <div className="schema-form">
                    <input
                        type="text"
                        value={selectedSchema.name || ''}
                        onChange={(e) => setSelectedSchema({ ...selectedSchema, name: e.target.value })}
                        placeholder="Schema Name"
                    />
                    <button onClick={saveSchema}>Save</button>
                </div>
            )}
        </div>
    );
}