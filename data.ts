import ConvertersSvg from '@/components/icons/ConvertersSvg';
import EncodersDecodersSvg from '@/components/icons/EncodersDecodersSvg';
import FormattersSvg from '@/components/icons/FormattersSvg';
import GeneratorsSvg from '@/components/icons/GeneratorsSvg';
import TextToolsSvg from '@/components/icons/TextToolsSvg';
import GraphicToolsSvg from '@/components/icons/GraphicToolsSvg';
import TimestampSvg from '@/components/icons/TimestampSvg';
import NumberBaseConverterSvg from '@/components/icons/NumberBaseConverterSvg';
import CronParserSvg from '@/components/icons/CronParserSvg';
import HtmlEncoderDecoderSvg from '@/components/icons/HtmlEncoderDecoderSvg';
import UrlEncoderDecoderSvg from '@/components/icons/UrlEncoderDecoderSvg';
import Base64EncoderDecoderSvg from '@/components/icons/Base64EncoderDecoderSvg';
import Base64ImageEncoderDecoderSvg from '@/components/icons/Base64ImageEncoderDecoderSvg';
import GZipEncoderDecoderSvg from '@/components/icons/GZipEncoderDecoderSvg';
import JwtDecoderSvg from '@/components/icons/JwtDecoderSvg';
import JsonFormatterSvg from '@/components/icons/JsonFormatterSvg';
import SqlFormatterSvg from '@/components/icons/SqlFormatterSvg';
import XmlFormatterSvg from '@/components/icons/XmlFormatterSvg';
import HashGereratorSvg from '@/components/icons/HashGereratorSvg';
import UuidGeneratorSvg from '@/components/icons/UuidGeneratorSvg';
import LoremIpsumGeneratorSvg from '@/components/icons/LoremIpsumGeneratorSvg';
import ChecksumGeneratorSvg from '@/components/icons/ChecksumGeneratorSvg';
import JsonYamlSvg from '@/components/icons/JsonYamlSvg';
import StringEscapeUnescapeSvg from '@/components/icons/StringEscapeUnescapeSvg';
import RegexTesterSvg from '@/components/icons/RegexTesterSvg';
import TextDiffSvg from '@/components/icons/TextDiffSvg';
import MarkdownPreviewSvg from '@/components/icons/MarkdownPreviewSvg';
import StringUtilitiesSvg from '@/components/icons/StringUtilitiesSvg';
import XMLValidatorSvg from '@/components/icons/XMLValidatorSvg';
import ColorBlindnessSimulatorSvg from '@/components/icons/ColorBlindnessSimulatorSvg';
import ColorPickerSvg from '@/components/icons/ColorPickerSvg';
import PngJpgCompressorSvg from '@/components/icons/PngJpgCompressorSvg';
import ImageConverterSvg from '@/components/icons/ImageConverterSvg';

const menuData: MenuItem[] = [
  {
    id: '1',
    label: 'Converters',
    isLeaf: false,
    icon: ConvertersSvg,
    children: [
      {
        id: '1-0',
        label: 'JSON < > YAML',
        isLeaf: true,
        icon: JsonYamlSvg,
        link: '/converters/json-yaml',
        name: 'JSON < > YAML Converter',
        description: 'Convert JSON data to YAML and vice versa',
      },
      {
        id: '1-1',
        label: 'Timestamp',
        isLeaf: true,
        icon: TimestampSvg,
        link: '/converters/timestamp',
        name: 'Unix Timestamp Converter',
        description: 'Convert timestamp to human-readable date and vice versa',
      },
      {
        id: '1-2',
        label: 'Number Base',
        isLeaf: true,
        icon: NumberBaseConverterSvg,
        link: '/converters/number-base',
        name: 'Number Base Converter',
        description: 'Convert numbers from one base to another',
      },
      {
        id: '1-3',
        label: 'Cron Parse',
        isLeaf: true,
        icon: CronParserSvg,
        link: '/converters/cron-parse',
        name: 'Cron expression parser',
        description: 'Parse Cron expression to get scheduled dates',
      },
    ],
  },
  {
    id: '2',
    label: 'Encoders / Decoders',
    isLeaf: false,
    icon: EncodersDecodersSvg,
    children: [
      {
        id: '2-0',
        label: 'HTML',
        isLeaf: true,
        icon: HtmlEncoderDecoderSvg,
        link: '/encoders-decoders/html',
        name: 'HTML Encoder / Decoder',
        // FIXME
        description:
          'Encode or decode all the applicable characters to their corresponding...',
      },
      {
        id: '2-1',
        label: 'URL',
        isLeaf: true,
        icon: UrlEncoderDecoderSvg,
        link: '/encoders-decoders/url',
        name: 'URL Encoder / Decoder',
        // FIXME
        description:
          'Encode or decode all the applicable characters to their corresponding UR...',
      },
      {
        id: '2-2',
        label: 'Base64 Text',
        isLeaf: true,
        icon: Base64EncoderDecoderSvg,
        link: '/encoders-decoders/base64-text',
        name: 'Base64 Text Encoder / Decoder',
        description: 'Encode or decode Base64 text data',
      },
      {
        id: '2-3',
        label: 'Base64 Image',
        isLeaf: true,
        icon: Base64ImageEncoderDecoderSvg,
        link: '/encoders-decoders/base64-image',
        name: 'Base64 Image Encoder / Decoder',
        description: 'Encode or decode Base64 image data',
      },
      {
        id: '2-4',
        label: 'GZip',
        isLeaf: true,
        icon: GZipEncoderDecoderSvg,
        link: '/encoders-decoders/gzip',
        name: 'GZip Compress / Decompress',
        description: 'Compress or decompress strings',
      },
      {
        id: '2-5',
        label: 'JWT',
        isLeaf: true,
        icon: JwtDecoderSvg,
        link: '/encoders-decoders/jwt-decoder',
        name: 'JWT Encoder / Decoder',
        description: 'Decode a JWT header, payload and signature',
      },
    ],
  },
  {
    id: '3',
    label: 'Formatters',
    isLeaf: false,
    icon: FormattersSvg,
    children: [
      {
        id: '3-0',
        label: 'JSON',
        isLeaf: true,
        icon: JsonFormatterSvg,
        link: '/formatters/json',
        name: 'JSON Formatter',
        description: 'Indent or minify JSON data',
      },
      {
        id: '3-1',
        label: 'SQL',
        isLeaf: true,
        icon: SqlFormatterSvg,
        link: '/formatters/sql',
        name: 'SQL Formatter',
        description: 'Indent SQL queries',
      },
      {
        id: '3-2',
        label: 'XML',
        isLeaf: true,
        icon: XmlFormatterSvg,
        link: '/formatters/xml',
        name: 'XML Formatter',
        description: 'Indent or minify XML data',
      },
    ],
  },
  {
    id: '4',
    label: 'Generators',
    isLeaf: false,
    icon: GeneratorsSvg,
    children: [
      {
        id: '4-0',
        label: 'Hash',
        isLeaf: true,
        icon: HashGereratorSvg,
        link: '/generators/hash',
        name: 'Hash Generator',
        description:
          'Calculate MD5, SHA1, SHA256 and SHA512 hash from text data',
      },
      {
        id: '4-1',
        label: 'UUID',
        isLeaf: true,
        icon: UuidGeneratorSvg,
        link: '/generators/uuid',
        name: 'UUID Generator',
        description: 'Generate UUIDs version 1 and 4',
      },
      {
        id: '4-2',
        label: 'Lorem Ipsum',
        isLeaf: true,
        icon: LoremIpsumGeneratorSvg,
        link: '/generators/lorem-ipsum',
        name: 'Lorem Ipsum Generator',
        description: 'Generate Lorem Ipsum placeholder text',
      },
      {
        id: '4-3',
        label: 'Checksum',
        isLeaf: true,
        icon: ChecksumGeneratorSvg,
        link: '/generators/check-sum',
        name: 'Checksum Generator',
        description: 'Generate a hash with Checksum based on a file',
      },
    ],
  },
  {
    id: '5',
    label: 'Text',
    isLeaf: false,
    icon: TextToolsSvg,
    children: [
      {
        id: '5-0',
        label: 'Escape / Unescape',
        isLeaf: true,
        icon: StringEscapeUnescapeSvg,
        link: '/text/escape-unescape',
        name: 'Text Escape / Unescape',
        // FIXME
        description:
          'Escapes or unescapes a string, removing characters that could...',
      },
      {
        id: '5-1',
        label: 'Inspector & Case Converter',
        isLeaf: true,
        icon: StringUtilitiesSvg,
        link: '/text/inspector-case-converter',
        name: 'Text Case Converter and Inspector',
        description: 'Analyze text and convert it to a different case',
      },
      {
        id: '5-2',
        label: 'Regex Tester',
        isLeaf: true,
        icon: RegexTesterSvg,
        link: '/text/regex-tester',
        name: 'Regex Tester',
        description: 'Validate and test regular expressions',
      },
      {
        id: '5-3',
        label: 'Text Diff',
        isLeaf: true,
        icon: TextDiffSvg,
        link: '/text/text-diff',
        name: 'Text Comparer',
        description: 'Compare two texts',
      },
      {
        id: '5-4',
        label: 'XML Validator',
        isLeaf: true,
        icon: XMLValidatorSvg,
        link: '/text/xml-validator',
        name: 'XML Validator',
        description: 'Validate XML data via an XSD schema',
      },
      {
        id: '5-5',
        label: 'Markdown Preview',
        isLeaf: true,
        icon: MarkdownPreviewSvg,
        link: '/text/markdown-preview',
        name: 'Markdown Preview',
        description: 'Preview a Markdown document with a GitHub-like render',
      },
    ],
  },
  {
    id: '6',
    label: 'Graphic',
    isLeaf: false,
    icon: GraphicToolsSvg,
    children: [
      {
        id: '6-0',
        label: 'Color Blindness Simulator',
        isLeaf: true,
        icon: ColorBlindnessSimulatorSvg,
        link: '/graphic/color-blindness-simulator',
        name: 'Color Blindness Simulator',
        description: 'Simulate color blindness on a picture or screenshot',
      },
      {
        id: '6-1',
        label: 'Color Picker & Contrast',
        isLeaf: true,
        icon: ColorPickerSvg,
        link: '/graphic/color-picker',
        name: 'Color Picker & Contrast',
        description: 'Pick up a color or two and validate the contrast ratio',
      },
      {
        id: '6-2',
        label: 'PNG / JPEG Compressor',
        isLeaf: true,
        icon: PngJpgCompressorSvg,
        link: '/graphic/png-jpeg-compressor',
        name: 'PNG / JPEG Compressor',
        description: 'Lossless PNG and JPEG optimizer',
      },
      {
        id: '6-3',
        label: 'Image Converter',
        isLeaf: true,
        icon: ImageConverterSvg,
        link: '/graphic/image-converter',
        name: 'Image Converter',
        description: 'Lossless image converter',
      },
    ],
  },
];

export default menuData;

export const toolList = menuData
  .reduce(
    (preVal, currentVal) => [...preVal, ...(currentVal.children ?? [])],
    [] as MenuItem[]
  )
  .sort((a, b) => a.name!.localeCompare(b.name!));
