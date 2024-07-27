import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [inputText, setInputText] = useState("");
  const [extractedEntities, setExtractedEntities] = useState([]);

  const handleExtract = () => {
    // Placeholder function for entity extraction
    // This should be replaced with actual API call or processing logic
    const mockExtractedEntities = [
      { name: "Headache", type: "Symptom", cui: "C0018681" },
      { name: "Aspirin", type: "Medication", cui: "C0004057" },
      { name: "Hypertension", type: "Condition", cui: "C0020538" },
    ];
    setExtractedEntities(mockExtractedEntities);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Clinical Entity Extractor</h1>
      <div className="max-w-2xl mx-auto">
        <Textarea
          placeholder="Enter clinical text here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="mb-4"
          rows={6}
        />
        <Button onClick={handleExtract} className="w-full mb-8">
          Extract Entities
        </Button>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Extracted Entities</h2>
          {extractedEntities.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {extractedEntities.map((entity, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{entity.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p><strong>Type:</strong> {entity.type}</p>
                    <p><strong>UMLS CUI:</strong> {entity.cui}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No clinical entities found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;