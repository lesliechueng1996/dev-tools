import { EyeIcon, ServerIcon } from '@heroicons/react/24/outline';
import NextImage from 'next/image';
import { useRef } from 'react';

type Props = {
  imageSrc: string;
  title?: string;
};

function ImagePreview({ imageSrc, title = '' }: Props) {
  const imageRef = useRef<HTMLImageElement>(null);

  const downloadImage = () => {
    const ext = imageSrc.split(';')[0].split(':')[1].split('/')[1];
    var link = document.createElement('a');
    link.href = imageSrc;
    link.download = `image.${ext}`;
    link.click();
  };

  // const saveImage = async () => {
  //   const dataUrl = imageSrc;
  //   const temp = imageSrc.split(';');
  //   const type = temp[0].split(':')[1];
  //   const blob = await (await fetch(dataUrl)).blob();
  //   navigator.clipboard
  //     .write([
  //       new ClipboardItem({
  //         [type]: blob,
  //       }),
  //     ])
  //     .then(() => {
  //       console.log('Copied image to clipboard');
  //     })
  //     .catch((error) => {
  //       console.error('Failed to copy image to clipboard: ', error);
  //     });
  // };

  return (
    <div className="flex-1 theme-bg theme-border p-5">
      {imageSrc && (
        <div>
          <div className="flex justify-between items-center">
            <h2>{title}</h2>
            <div className="flex gap-3 justify-end mb-3">
              <button
                className="theme-button"
                onClick={() => {
                  const img = new Image();
                  img.src = imageSrc;

                  const newWin = window.open('', '_blank');
                  newWin!.document.write(img.outerHTML);
                  newWin!.document.title = 'Preview';
                  newWin!.document.close();
                }}
              >
                <EyeIcon className="w-6 h-6" />
                View
              </button>
              {/* <button
                className="bg-white rounded-md px-3 py-2 shadow"
                title="Copy"
                onClick={saveImage}
              >
                <DocumentDuplicateIcon className="w-6 h-6" />
              </button> */}
              <button
                className="theme-button"
                title="Save as"
                onClick={() => {
                  downloadImage();
                }}
              >
                <ServerIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
          <NextImage
            ref={imageRef}
            src={imageSrc}
            alt="preview"
            width={700}
            height={475}
            className="w-full h-auto"
          />
        </div>
      )}
    </div>
  );
}

export default ImagePreview;
