import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import PlugImage from '@assets/icons/qr-icon.png';
import QRCodeUtil from 'qrcode';
import useStyles from './styles';

const generateMatrix = (value, errorCorrectionLevel) => {
  const arr = Array.prototype.slice.call(
    QRCodeUtil.create(value, { errorCorrectionLevel }).modules.data,
    0,
  );
  const sqrt = Math.sqrt(arr.length);
  return arr.reduce(
    (rows, key, index) => (index % sqrt === 0
      ? rows.push([key])
      : rows[rows.length - 1].push(key)) && rows,
    [],
  );
};

const QRCode = ({
  ecl,
  logo,
  logoBackgroundColor,
  logoMargin,
  logoSize,
  size,
  value,
  ...other
}) => {
  const classes = useStyles();
  const href = logo; // useSafeImageUri(logo); check this later
  const dots = useMemo(() => {
    const dotsArray = [];
    const matrix = generateMatrix(value, ecl);
    const cellSize = size / matrix.length;
    const qrList = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
    ];

    qrList.forEach(({ x, y }) => {
      const x1 = (matrix.length - 7) * cellSize * x;
      const y1 = (matrix.length - 7) * cellSize * y;
      for (let i = 0; i < 3; i += 1) {
        dotsArray.push(
          <rect
            fill={i % 2 !== 0 ? 'white' : 'black'}
            height={cellSize * (7 - i * 2)}
            rx={(i - 3) * -2 + (i === 0 ? 2 : 0)} // calculated border radius for corner squares
            ry={(i - 3) * -2 + (i === 0 ? 2 : 0)} // calculated border radius for corner squares
            width={cellSize * (7 - i * 2)}
            x={x1 + cellSize * i}
            y={y1 + cellSize * i}
          />,
        );
      }
    });

    const clearArenaSize = Math.floor((logoSize + 3) / cellSize);
    const matrixMiddleStart = matrix.length / 2 - clearArenaSize / 2;
    const matrixMiddleEnd = matrix.length / 2 + clearArenaSize / 2 - 1;

    matrix.forEach((row, i) => {
      row.forEach((column, j) => {
        if (matrix[i][j]) {
          if (
            !(
              (i < 7 && j < 7)
              || (i > matrix.length - 8 && j < 7)
              || (i < 7 && j > matrix.length - 8)
            )
          ) {
            if (
              !(
                i > matrixMiddleStart
                && i < matrixMiddleEnd
                && j > matrixMiddleStart
                && j < matrixMiddleEnd
                && i < j + clearArenaSize / 2
                && j < i + clearArenaSize / 2 + 1
              )
            ) {
              dotsArray.push(
                <circle
                  cx={i * cellSize + cellSize / 2}
                  cy={j * cellSize + cellSize / 2}
                  fill="black"
                  r={cellSize / 3} // calculate size of single dots
                />,
              );
            }
          }
        }
      });
    });

    return dotsArray;
  }, [ecl, logoSize, size, value]);

  const logoPosition = size / 2 - logoSize / 2 - logoMargin;
  const logoWrapperSize = logoSize + logoMargin * 2;

  return (
    <div className={classes.root} {...other}>
      <svg height={size} width={size}>
        <defs>
          <clipPath id="clip-wrapper">
            <rect height={logoWrapperSize} width={logoWrapperSize} />
          </clipPath>
          <clipPath id="clip-logo">
            <rect height={logoSize} width={logoSize} />
          </clipPath>
        </defs>
        <rect fill="white" height={size} width={size} />
        {dots}
        {logo && (
          <g transform={`translate(${logoPosition},${logoPosition})`}>
            <rect
              clipPath="url(#clip-wrapper)"
              fill={logoBackgroundColor}
              height={logoWrapperSize}
              width={logoWrapperSize}
            />
            <g x={logoMargin} y={logoMargin}>
              <image
                clipPath="url(#clip-logo)"
                height={logoSize}
                href={href}
                preserveAspectRatio="xMidYMid slice"
                width={logoSize}
              />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};

export default QRCode;

QRCode.defaultProps = {
  ecl: 'H',
  logo: PlugImage,
  logoBackgroundColor: 'white',
  logoMargin: 0,
  logoSize: 53,
  size: 190,
  value: '0xc6e8e3897dac52a68428020463484257222a3e5f',
};

QRCode.propTypes = {
  ecl: PropTypes.string,
  logo: PropTypes.string,
  logoBackgroundColor: PropTypes.string,
  logoMargin: PropTypes.number,
  logoSize: PropTypes.number,
  size: PropTypes.number,
  value: PropTypes.string,
};
