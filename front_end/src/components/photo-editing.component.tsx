import React, {useEffect, useRef, useState} from 'react';
import Carousel from "../common/Carousel";
import './photo-editing.component.css';

import image1 from '../photo/1.jpg';
import image2 from '../photo/2.jpg';
import image3 from '../photo/3.jpg';
import image4 from '../photo/4.jpg';
import image5 from '../photo/5.jpg';
import image6 from '../photo/6.jpg';
import image7 from '../photo/7.jpg';
import image8 from '../photo/8.jpg';

import line from './icons/line.png';
import circle from './icons/circle.png';
import square from './icons/square.png';
import arrow from './icons/arrow.png';

const PhotoEditing: React.FC = () => {
    const [isDrawing, setIsDrawing] = useState(false);
    const [lineWidth, setLineWidth] = useState(10);
    const [currentColor, setCurrentColor] = useState('#000000');
    const [tool, setTool] = useState('line');
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const images = [image1, image2, image3, image4, image5, image6, image7, image8];
    const initialRadius = 10;
    const [circleCenter, setCircleCenter] = useState({x: 0, y: 0});
    const [circleRadius, setCircleRadius] = useState(initialRadius);
    const [squareStartPos, setSquareStartPos] = useState({x: 0, y: 0});
    const [squareEndPos, setSquareEndPos] = useState({x: 0, y: 0});
    const [arrowStartPos, setArrowStartPos] = useState({x: 0, y: 0});
    const [arrowEndPos, setArrowEndPos] = useState({x: 0, y: 0});

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
    }, [lineWidth, currentColor]);

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
                ctx.beginPath();
                ctx.moveTo(x, y);
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
            case 'text':
                setSquareStartPos({x, y});
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
                    drawLine(x, y);
                    break;
                case 'circle':
                    setCircleRadius(Math.sqrt((x - circleCenter.x) ** 2 + (y - circleCenter.y) ** 2));
                    break;
                case 'square':
                    setSquareEndPos({x, y});
                    break;
                case 'arrow':
                    setArrowEndPos({x, y});
                    break;
                case 'text':
                    setSquareEndPos({x, y});
                    break;
                default:
                    break;
            }
        }
    };

    const handleMouseUp = () => {
        setIsDrawing(false);

        switch (tool) {
            case 'circle':
                drawCircle();
                break;
            case 'square':
                drawSquare();
                break;
            case 'arrow':
                drawArrow();
                break;
            case 'text':
                drawSquare();
                break;
            default:
                break;
        }
    };

    const drawLine = (x: number, y: number) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d', {willReadFrequently: true});
            if (ctx) {
                scalingLine(canvas, ctx);
                ctx.lineTo(x, y);
                ctx.stroke();
            }
        }
    };

    const drawCircle = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d', {willReadFrequently: true});
            if (ctx) {
                scalingLine(canvas, ctx);
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
                scalingLine(canvas, ctx);
                ctx.strokeRect(squareStartPos.x, squareStartPos.y, width, height);
            }
        }
    };

    const drawArrow = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                scalingLine(canvas, ctx);
                const arrowSize = lineWidth + 10;
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

    const scalingLine = (canvas: any, ctx: any) => {
        const scaleX = canvas.width / canvas.offsetWidth;
        const scaleY = canvas.height / canvas.offsetHeight;

        const lineWidthX = 5 * lineWidth / scaleX;
        const lineWidthY = 5 * lineWidth / scaleY;

        ctx.lineWidth = Math.min(lineWidthX, lineWidthY);
    }

    const handleChangeLineWidth = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLineWidth(parseInt(event.target.value));
    };

    const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentColor(event.target.value);
    };

    const handleToolChange = (tool: string) => {
        setTool(tool);
    };

    const handleDrop = (event: React.DragEvent<HTMLCanvasElement>) => {
        event.preventDefault();
        const src = event.dataTransfer.getData('text/plain');
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

    return (
        <div>
            <Carousel images={images}/>
            <div className="mainContainer">
                <div className="tools">
                    <div>
                        <button onClick={() => handleToolChange("line")} className="button">
                            <img src={line} alt="line" className="icon"/>
                        </button>
                        <button onClick={() => handleToolChange("circle")} className="button">
                            <img src={circle} alt="circle" className="icon"/>
                        </button>
                        <button onClick={() => handleToolChange("square")} className="button">
                            <img src={square} alt="square" className="icon"/>
                        </button>
                        <button onClick={() => handleToolChange("arrow")} className="button">
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
                        <p>Width:</p>
                        <p>{lineWidth}</p>
                    </div>
                    <input type="range" min="1" max="30" value={lineWidth} onChange={handleChangeLineWidth}/>
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

export default PhotoEditing;
