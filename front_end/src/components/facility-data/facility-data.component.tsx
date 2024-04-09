import React, {useEffect, useRef, useState} from 'react';
import Carousel from "./Carousel";
import './facility-data.css';
import ImageUploader from './ImageUploader';

import line from '../icons/line.png';
import circle from '../icons/circle.png';
import square from '../icons/square.png';
import arrow from '../icons/arrow.png';
import {Link, useParams} from "react-router-dom";
import ImageUploadDownloadService from "../../services/image-upload-download.service";
import {scaledLineWidth} from "../../common/Constants";
import handleError from "../../common/ErrorHandler";
import Alert from "../../common/Alert";

type State = {
    message: string;
    successful: boolean;
};

const FacilityData: React.FC = () => {
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const {facilityId} = useParams<{ facilityId: string }>();
    const [isDrawing, setIsDrawing] = useState(false);
    const [lineWidth, setLineWidth] = useState(5);
    const [currentColor, setCurrentColor] = useState('#000000');
    const [tool, setTool] = useState('line');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const initialRadius = 10;
    const [circleCenter, setCircleCenter] = useState({x: 0, y: 0});
    const [circleRadius, setCircleRadius] = useState(initialRadius);
    const [circleRadiusPoints, setCircleRadiusPoints] = useState({x: 0, y: 0});
    const [squareStartPos, setSquareStartPos] = useState({x: 0, y: 0});
    const [squareEndPos, setSquareEndPos] = useState({x: 0, y: 0});
    const [arrowStartPos, setArrowStartPos] = useState({x: 0, y: 0});
    const [arrowEndPos, setArrowEndPos] = useState({x: 0, y: 0});
    const [lineStartPos, setLineStartPos] = useState({x: 0, y: 0});
    const [lineEndPos, setLineEndPos] = useState({x: 0, y: 0});
    const [drawnElements, setDrawnElements] = useState<any[]>([]);
    const [selectedImageUrl, setSelectedImageUrl] = useState<string>("");
    const [activeButton, setActiveButton] = useState(0);
    const [state, setState] = useState<State>({
        message: "",
        successful: false
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d', {willReadFrequently: true});
            if (ctx) {
                ctx.imageSmoothingEnabled = false;
                ctx.lineWidth = lineWidth;
                ctx.lineCap = 'round';
                ctx.strokeStyle = currentColor;
            }
        }
    }, [uploadedImages, lineWidth, currentColor]);

    const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        setIsDrawing(true);
        const ctx = canvas.getContext('2d', {willReadFrequently: true});
        if (!ctx) return;

        const canvasRect = canvas.getBoundingClientRect();

        const scaleX = canvas.width / canvasRect.width;
        const scaleY = canvas.height / canvasRect.height;

        const x = (event.clientX - canvasRect.left) * scaleX;
        const y = (event.clientY - canvasRect.top) * scaleY;

        switch (tool) {
            case 'line':
                setLineStartPos({x, y});
                break;
            case 'circle':
                setCircleCenter({x, y});
                break;
            case 'square':
                setSquareStartPos({x, y});
                break;
            case 'arrow':
                setArrowStartPos({x, y});
                break;
            default:
                break;
        }
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (isDrawing) {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const canvasRect = canvas.getBoundingClientRect();

            const scaleX = canvas.width / canvasRect.width;
            const scaleY = canvas.height / canvasRect.height;

            const x = (event.clientX - canvasRect.left) * scaleX;
            const y = (event.clientY - canvasRect.top) * scaleY;

            switch (tool) {
                case 'line':
                    setLineEndPos({x, y});
                    break;
                case 'circle':
                    setCircleRadius(Math.sqrt((x - circleCenter.x) ** 2 + (y - circleCenter.y) ** 2));
                    setCircleRadiusPoints({x, y});
                    break;
                case 'square':
                    setSquareEndPos({x, y});
                    break;
                case 'arrow':
                    setArrowEndPos({x, y});
                    break;
                default:
                    break;
            }
        }
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
        let newElement: any = null;

        switch (tool) {
            case 'line':
                newElement = {
                    type: 'line',
                    startPos: lineStartPos,
                    endPos: lineEndPos,
                    color: currentColor,
                    lineWidth: lineWidth
                };
                drawLine();
                break;
            case 'circle':
                newElement = {
                    type: 'circle',
                    center: circleCenter,
                    radius: circleRadiusPoints,
                    color: currentColor,
                    lineWidth: lineWidth
                };
                drawCircle();
                break;
            case 'square':
                newElement = {
                    type: 'square',
                    startPos: squareStartPos,
                    endPos: squareEndPos,
                    color: currentColor,
                    lineWidth: lineWidth
                };
                drawSquare();
                break;
            case 'arrow':
                newElement = {
                    type: 'arrow',
                    startPos: arrowStartPos,
                    endPos: arrowEndPos,
                    color: currentColor,
                    lineWidth: lineWidth,
                };
                drawArrow();
                break;
            default:
                break;
        }

        if (newElement) {
            setDrawnElements([...drawnElements, newElement]);
        }
    };

    const drawCircle = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d', {willReadFrequently: true});
            if (ctx) {
                ctx.beginPath();
                ctx.arc(circleCenter.x, circleCenter.y, circleRadius, 0, 2 * Math.PI);
                ctx.stroke();
            }
        }
    };

    const drawSquare = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                const width = squareEndPos.x - squareStartPos.x;
                const height = squareEndPos.y - squareStartPos.y;
                ctx.strokeRect(squareStartPos.x, squareStartPos.y, width, height);
            }
        }
    };

    const drawLine = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.beginPath();
                ctx.moveTo(lineStartPos.x, lineStartPos.y);
                ctx.lineTo(lineEndPos.x, lineEndPos.y);
                ctx.stroke();
            }
        }
    };

    const drawArrow = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                let arrowSize;
                if (lineWidth < 5) {
                    const scale = lineWidth + 5 - (lineWidth - 1) * 0.5;
                    arrowSize = scaledLineWidth[lineWidth] + scale;
                } else {
                    arrowSize = lineWidth + scaledLineWidth[lineWidth];
                }

                const angle = Math.atan2(arrowEndPos.y - arrowStartPos.y, arrowEndPos.x - arrowStartPos.x);
                const arrowEndAdjustedX = arrowEndPos.x - arrowSize * Math.cos(angle);
                const arrowEndAdjustedY = arrowEndPos.y - arrowSize * Math.sin(angle);

                ctx.beginPath();
                ctx.moveTo(arrowStartPos.x, arrowStartPos.y);
                ctx.lineTo(arrowEndAdjustedX, arrowEndAdjustedY);
                ctx.stroke();

                ctx.save();
                ctx.translate(arrowEndPos.x, arrowEndPos.y);
                ctx.rotate(angle);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(-arrowSize, -arrowSize);
                ctx.lineTo(-arrowSize, arrowSize);
                ctx.closePath();
                ctx.fillStyle = currentColor;
                ctx.fill();
                ctx.restore();
            }
        }
    };

    const handleChangeLineWidth = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLineWidth(parseInt(event.target.value));
    };

    const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentColor(event.target.value);
    };

    const handleToolChange = (tool: string, buttonId: number) => {
        setTool(tool);
        setActiveButton(buttonId);
    };

    const handleDrop = (event: React.DragEvent<HTMLCanvasElement>) => {
        event.preventDefault();
        const src = event.dataTransfer.getData('text/plain');
        setSelectedImageUrl(src);
        setDrawnElements([]);
        const canvas = event.currentTarget;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.imageSmoothingEnabled = false;

            const img = new Image();
            img.src = src;
            img.onload = () => {

                canvas.width = img.width;
                canvas.height = img.height;

                ctx.lineWidth = lineWidth;
                ctx.strokeStyle = currentColor;
                ctx.drawImage(img, 0, 0);
            };
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLCanvasElement>) => {
        event.preventDefault();
    };

    const handleImagesUploaded = (data: any) => {
        setUploadedImages(data.image_urls);
    };

    const saveCanvasImage = (facilityId: number) => {
        ImageUploadDownloadService.sendElements(drawnElements, selectedImageUrl, facilityId)
            .then((response) => {
                const newImageUrl = response.data.image_url;
                const updatedImages = [...uploadedImages, newImageUrl];
                setUploadedImages(updatedImages);
            })
            .catch((error) => {
                handleError(error, setState);
            });
    };

    const {message, successful} = state;

    const handleImagesSelected = (selectedImages: string[]) => {
        localStorage.setItem('selectedImagesForReport', JSON.stringify(selectedImages));
        localStorage.setItem('facilityId', facilityId!);
    };

    return (
        <div className="container mt-3">
            <Carousel images={uploadedImages} onImagesSelected={handleImagesSelected}/>
            <div className="mainContainer">
                <div className="tools">
                    <div>
                        <ImageUploader facilityId={facilityId ? parseInt(facilityId) : 0} images={uploadedImages}
                                       onImagesUploaded={handleImagesUploaded}/>
                    </div>

                    <div>
                        <button onClick={() => handleToolChange("line", 1)}
                                style={{borderColor: activeButton === 1 ? '#aac4e6' : 'black'}}
                                className="tool-button">
                            <img src={line} alt="line" className="icon"/>
                        </button>
                        <button onClick={() => handleToolChange("circle", 2)}
                                style={{borderColor: activeButton === 2 ? '#aac4e6' : 'black'}}
                                className="tool-button">
                            <img src={circle} alt="circle" className="icon"/>
                        </button>
                        <button onClick={() => handleToolChange("square", 3)}
                                style={{borderColor: activeButton === 3 ? '#aac4e6' : 'black'}}
                                className="tool-button">
                            <img src={square} alt="square" className="icon"/>
                        </button>
                        <button onClick={() => handleToolChange("arrow", 4)}
                                style={{borderColor: activeButton === 4 ? '#aac4e6' : 'black'}}
                                className="tool-button">
                            <img src={arrow} alt="arrow" className="icon"/>
                        </button>
                    </div>

                    <div>
                        <input
                            type="color"
                            value={currentColor}
                            onChange={handleColorChange}
                        />
                    </div>

                    <div className="width">
                        <span>Width:</span>
                        <span>{lineWidth}</span>
                    </div>
                    <input type="range" min="1" max="20" value={lineWidth} onChange={handleChangeLineWidth}/>

                    <div>
                        <button className="btn btn-secondary button"
                                onClick={() => saveCanvasImage(facilityId ? parseInt(facilityId) : 0)}>Save image
                        </button>
                    </div>

                    <Link to={'/defect-list'}
                          className="btn btn-primary button">
                        <span>Analysis</span>
                    </Link>

                    <Alert successful={successful} message={message}/>
                </div>

                <div className="container">
                    <canvas
                        ref={canvasRef}
                        id="mainCanvas"
                        width="800"
                        height="350"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                    ></canvas>
                </div>
            </div>
        </div>
    );
};

export default FacilityData;
