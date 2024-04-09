import React, {useEffect, useState} from 'react';
import ImageUploadDownloadService from "../../services/image-upload-download.service";
import './ImageUploader.css';
import handleError from "../../common/ErrorHandler";
import Alert from "../../common/Alert";

interface ImageUploaderProps {
    images: string[];
    onImagesUploaded: (urls: string[]) => void;
    facilityId: number;
}

type State = {
    message: string;
    successful: boolean;
};

const ImageUploader: React.FC<ImageUploaderProps> = ({facilityId, onImagesUploaded}) => {
    const [state, setState] = useState<State>({
        message: "",
        successful: false
    });

    useEffect(() => {
        getImages()
    }, [facilityId]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('images', files[i]);
        }

        ImageUploadDownloadService.upload(formData, facilityId)
            .then(() => {
                getImages();
            })
            .catch((error) => {
                handleError(error, setState);
            });
    };

    const getImages = () => {
        ImageUploadDownloadService.get(facilityId)
            .then((response) => {
                onImagesUploaded(response.data);
            })
            .catch((error) => {
                handleError(error, setState);
            });
    };

    const {message, successful} = state;

    return (
        <div>
            <Alert successful={successful} message={message}/>
            <div className="input_wrapper">
                <input name="file" type="file" id="input_file" className="input input_file" onChange={handleFileChange}
                       multiple/>
                <label htmlFor="input_file" className="btn btn-secondary">
                    <span>Upload images</span>
                </label>
            </div>
        </div>
    );
};

export default ImageUploader;
