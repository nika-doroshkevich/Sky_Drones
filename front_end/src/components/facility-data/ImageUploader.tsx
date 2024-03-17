import React, {useState} from 'react';
import ImageUploadDownloadService from "../../services/image-upload-download.service";
import './ImageUploader.css';

interface ImageUploaderProps {
    images: string[];
    onImagesUploaded: (urls: string[]) => void;
    facilityId: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({images, facilityId}) => {
    const [imageUrls, setImageUrls] = useState<string[]>(images);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('images', files[i]);
        }

        try {
            await ImageUploadDownloadService.upload(formData, facilityId);
            //setImageUrls(response.data);
        } catch (error) {
            console.error('Error uploading images:', error);
        }
    };

    return (
        <div>
            <div className="input_wrapper">
                <input name="file" type="file" id="input_file" className="input input_file" onChange={handleFileChange}
                       multiple/>
                <label htmlFor="input_file" className="input_file-button">
                    <span className="input_file-button-text">Choose images</span>
                </label>
            </div>
        </div>
    );
};

export default ImageUploader;
