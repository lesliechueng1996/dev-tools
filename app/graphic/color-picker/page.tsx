import HsvColorPicker from '@/components/HsvColorPicker';
import HsvColor from '@/components/HsvColorPicker/HsvColor';

function ColorPickerPage() {
  return (
    <div>
      <h1 className="text-3xl mb-5">Color Picker & Contrast</h1>

      <div>
        <h2>Configuration</h2>
        <div>{/* Change Color Mode */}</div>
      </div>

      <div>
        <h2>Selected color</h2>
        <div>{/* Selected color */}</div>
      </div>

      <div>
        <h2>Contrast ratio</h2>
        <div>{/* Contrast ratio */}</div>
      </div>

      <div>
        <div>
          <HsvColorPicker
            width={300}
            defaultColor={
              new HsvColor({
                hue: 128,
                saturation: 65,
                value: 69,
                opacity: 200,
              })
            }
          />
        </div>
        <div>{/* Background color picker */}</div>
      </div>
    </div>
  );
}

export default ColorPickerPage;
