import React, {useEffect, useState} from 'react';
import './Carousel.css';

const imageNumber = 7;

interface CarouselProps {
    images: string[];
}

const ImageWithCheckbox: React.FC<{ src: string; onClick: () => void; isSelected: boolean }> = ({
                                                                                                    src,
                                                                                                    onClick,
                                                                                                    isSelected
                                                                                                }) => {
    const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        event.dataTransfer.setData('text/plain', src);
    };

    return (
        <div className={`image-container ${isSelected ? 'selected' : ''}`} onClick={onClick} draggable
             onDragStart={handleDragStart}>
            <div className="image-wrapper">
                <img src={src} alt="carousel-image" className="image"/>
                {isSelected && <div className="circle checkmark">&#10003;</div>}
            </div>
        </div>
    );
};


const Carousel: React.FC<CarouselProps> = ({images}) => {
    const [selectedImages, setSelectedImages] = useState<boolean[]>(Array(images.length).fill(false));
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isStart, setIsStart] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    useEffect(() => {
        setIsStart(currentImageIndex === 0);
        setIsEnd(currentImageIndex + imageNumber >= images.length);
    }, [currentImageIndex, images]);

    const goToPreviousSlide = () => {
        const newIndex = currentImageIndex - 1;
        setCurrentImageIndex(newIndex < 0 ? 0 : newIndex);
    };

    const goToNextSlide = () => {
        const newIndex = currentImageIndex + 1;
        setCurrentImageIndex(newIndex >= images.length ? currentImageIndex : newIndex);
    };

    const handleImageClick = (index: number) => {
        const newSelectedImages = [...selectedImages];
        newSelectedImages[index] = !newSelectedImages[index];
        setSelectedImages(newSelectedImages);
    };

    return (
        <div className="carousel-container">
            <div className="carousel">
                {images.slice(currentImageIndex, currentImageIndex + imageNumber).map((image, index) => (
                    <ImageWithCheckbox
                        key={index}
                        src={image}
                        onClick={() => handleImageClick(currentImageIndex + index)}
                        isSelected={selectedImages[currentImageIndex + index]}
                    />
                ))}
            </div>
            <button onClick={goToPreviousSlide} disabled={isStart}
                    className={`circle arrow left ${isStart ? 'disabled' : ''}`}>&lt;</button>
            <button onClick={goToNextSlide} disabled={isEnd}
                    className={`circle arrow right ${isEnd ? 'disabled' : ''}`}>&gt;</button>
        </div>
    );
};


export default Carousel;
