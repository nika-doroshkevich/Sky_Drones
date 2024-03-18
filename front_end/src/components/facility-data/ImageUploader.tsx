import React, {useEffect} from 'react';
import ImageUploadDownloadService from "../../services/image-upload-download.service";
import './ImageUploader.css';

interface ImageUploaderProps {
    images: string[];
    onImagesUploaded: (urls: string[]) => void;
    facilityId: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({facilityId, onImagesUploaded}) => {

    useEffect(() => {
        getImages().then(_ => {
        });
    }, [facilityId]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('images', files[i]);
        }

        try {
            await ImageUploadDownloadService.upload(formData, facilityId);
            await getImages();
        } catch (error) {
            console.error('Error uploading images:', error);
        }
    };

    const getImages = async () => {
        try {
            const response = await ImageUploadDownloadService.get(facilityId);
            onImagesUploaded(response.data);
        } catch (error) {
            console.error('Error getting images:', error);
        }
    };

    return (
        <div>
            <div className="input_wrapper">
                <input name="file" type="file" id="input_file" className="input input_file" onChange={handleFileChange}
                       multiple/>
                <label htmlFor="input_file" className="input_file-button">
                    <span className="input_file-button-text">Upload images</span>
                </label>
            </div>
        </div>
    );
};

export default ImageUploader;
