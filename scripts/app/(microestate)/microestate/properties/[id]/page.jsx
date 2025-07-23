"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import DocumentManager from '../DocumentManager';
export default function PropertyDetailsPage() {
    const params = useParams();
    const id = params.id;
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(false);
    const [contacted, setContacted] = useState(false);
    useEffect(() => {
        if (!id)
            return;
        setLoading(true);
        axios.get(`/api/properties/${id}`).then(res => {
            setProperty(res.data.property);
            setLoading(false);
        });
    }, [id]);
    const handleDownload = (docId) => {
        window.open(`/api/properties/${id}/docs/${docId}`, '_blank');
    };
    const handleContact = async () => {
        await axios.post(`/api/properties/${id}/contact`);
        setContacted(true);
    };
    if (loading || !property)
        return <div>Loading...</div>;
    return (<div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">{property.title}</h1>
      <p className="text-white mb-2">{property.description}</p>
      <p className="text-white mb-1">Location: {property.location}</p>
      <p className="text-white mb-1">Size: {property.size} sqft</p>
      <p className="text-orange-400 font-bold mb-4">₹{property.price}</p>
      {property.images && property.images.length > 0 && (<div className="flex gap-4 mb-4">
          {property.images.map((img, idx) => (<img key={idx} src={img} alt="Property" className="w-48 h-32 object-cover rounded"/>))}
        </div>)}
      {property.docs && property.docs.length > 0 && (<div className="mb-4">
          <h2 className="text-lg font-semibold text-white mb-2">Documents</h2>
          {property.docs.map(doc => (<Button key={doc._id} onClick={() => handleDownload(doc._id)} className="mr-2 mb-2">Download {doc.name}</Button>))}
        </div>)}
      <Button onClick={handleContact} disabled={contacted} className="bg-gradient-to-r from-orange-600 to-red-500 text-white">
        {contacted ? 'Contacted!' : 'Contact Landlord'}
      </Button>
      <DocumentManager />
    </div>);
}
