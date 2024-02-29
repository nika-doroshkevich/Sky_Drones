import React, {useState} from 'react';
import axios from 'axios';

const ImageUploader: React.FC = () => {
    const [imageUrl, setImageUrl] = useState<string>('');

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        console.log(file);

        try {
            const response = await axios.post<string>('/api/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setImageUrl(response.data);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange}/>
            {imageUrl && <img src={imageUrl} alt="Uploaded"/>}
        </div>
    );
};

export default ImageUploader;
