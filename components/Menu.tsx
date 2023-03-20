'use client';

import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import MenuRow from './MenuRow';
import AllToolsSvg from './icons/AllToolsSvg';
import ConvertersSvg from './icons/ConvertersSvg';
import EncodersDecodersSvg from './icons/EncodersDecodersSvg';
import FormattersSvg from './icons/FormattersSvg';
import GeneratorsSvg from './icons/GeneratorsSvg';
import TextToolsSvg from './icons/TextToolsSvg';
import GraphicToolsSvg from './icons/GraphicToolsSvg';
import TimestampSvg from './icons/TimestampSvg';
import NumberBaseConverterSvg from './icons/NumberBaseConverterSvg';
import CronParserSvg from './icons/CronParserSvg';
import HtmlEncoderDecoderSvg from './icons/HtmlEncoderDecoderSvg';
import UrlEncoderDecoderSvg from './icons/UrlEncoderDecoderSvg';
import Base64EncoderDecoderSvg from './icons/Base64EncoderDecoderSvg';
import Base64ImageEncoderDecoderSvg from './icons/Base64ImageEncoderDecoderSvg';
import GZipEncoderDecoderSvg from './icons/GZipEncoderDecoderSvg';
import JwtDecoderSvg from './icons/JwtDecoderSvg';
import JsonFormatterSvg from './icons/JsonFormatterSvg';
import SqlFormatterSvg from './icons/SqlFormatterSvg';
import XmlFormatterSvg from './icons/XmlFormatterSvg';
import HashGereratorSvg from './icons/HashGereratorSvg';
import UuidGeneratorSvg from './icons/UuidGeneratorSvg';
import LoremIpsumGeneratorSvg from './icons/LoremIpsumGeneratorSvg';
import ChecksumGeneratorSvg from './icons/ChecksumGeneratorSvg';
import JsonYamlSvg from './icons/JsonYamlSvg';
import StringEscapeUnescapeSvg from './icons/StringEscapeUnescapeSvg';
import RegexTesterSvg from './icons/RegexTesterSvg';
import TextDiffSvg from './icons/TextDiffSvg';
import MarkdownPreviewSvg from './icons/MarkdownPreviewSvg';
import StringUtilitiesSvg from './icons/StringUtilitiesSvg';
import XMLValidatorSvg from './icons/XMLValidatorSvg';
import ColorBlindnessSimulatorSvg from './icons/ColorBlindnessSimulatorSvg';
import ColorPickerSvg from './icons/ColorPickerSvg';
import PngJpgCompressorSvg from './icons/PngJpgCompressorSvg';
import ImageConverterSvg from './icons/ImageConverterSvg';

function Menu() {
  const [menus, setMenus] = useState<MenuItem[]>([
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
        },
        {
          id: '1-1',
          label: 'Timestamp',
          isLeaf: true,
          icon: TimestampSvg,
        },
        {
          id: '1-3',
          label: 'Number Base',
          isLeaf: true,
          icon: NumberBaseConverterSvg,
        },
        {
          id: '1-4',
          label: 'Cron Parse',
          isLeaf: true,
          icon: CronParserSvg,
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
        },
        {
          id: '2-1',
          label: 'URL',
          isLeaf: true,
          icon: UrlEncoderDecoderSvg,
        },
        {
          id: '2-3',
          label: 'Base64 Text',
          isLeaf: true,
          icon: Base64EncoderDecoderSvg,
        },
        {
          id: '2-4',
          label: 'Base64 Image',
          isLeaf: true,
          icon: Base64ImageEncoderDecoderSvg,
        },
        {
          id: '2-5',
          label: 'GZip',
          isLeaf: true,
          icon: GZipEncoderDecoderSvg,
        },
        {
          id: '2-6',
          label: 'JWT Decoder',
          isLeaf: true,
          icon: JwtDecoderSvg,
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
        },
        {
          id: '3-1',
          label: 'SQL',
          isLeaf: true,
          icon: SqlFormatterSvg,
        },
        {
          id: '3-2',
          label: 'XML',
          isLeaf: true,
          icon: XmlFormatterSvg,
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
        },
        {
          id: '4-1',
          label: 'UUID',
          isLeaf: true,
          icon: UuidGeneratorSvg,
        },
        {
          id: '4-2',
          label: 'Lorem Ipsum',
          isLeaf: true,
          icon: LoremIpsumGeneratorSvg,
        },
        {
          id: '4-3',
          label: 'Checksum',
          isLeaf: true,
          icon: ChecksumGeneratorSvg,
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
        },
        {
          id: '5-1',
          label: 'Inspector & Case Converter',
          isLeaf: true,
          icon: StringUtilitiesSvg,
        },
        {
          id: '5-2',
          label: 'Regex Tester',
          isLeaf: true,
          icon: RegexTesterSvg,
        },
        {
          id: '5-3',
          label: 'Text Diff',
          isLeaf: true,
          icon: TextDiffSvg,
        },
        {
          id: '5-4',
          label: 'XML Validator',
          isLeaf: true,
          icon: XMLValidatorSvg,
        },
        {
          id: '5-5',
          label: 'Markdown Preview',
          isLeaf: true,
          icon: MarkdownPreviewSvg,
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
        },
        {
          id: '6-1',
          label: 'Color Picker & Contrast',
          isLeaf: true,
          icon: ColorPickerSvg,
        },
        {
          id: '6-2',
          label: 'PNG / JPEG Compressor',
          isLeaf: true,
          icon: PngJpgCompressorSvg,
        },
        {
          id: '6-3',
          label: 'Image Converter',
          isLeaf: true,
          icon: ImageConverterSvg,
        },
      ],
    },
  ]);

  const clickMenu = (id: string) => {
    let index = menus.findIndex((menu) => menu.id === id);
    let copy = [];

    for (let i = 0; i < menus.length; i++) {
      if (i === index) {
        copy.push({
          ...menus[i],
          expand: !menus[i].expand,
        });
      } else {
        copy.push(menus[i]);
      }
    }
    setMenus(copy);
  };

  return (
    <>
      <div className="px-2 mb-3">
        <div className="w-full pt-5 px-5 mb-5">
          <div className="dark:bg-slate-800 flex items-center rounded-sm px-3 py-1 border-b-white/70 border-b-2">
            <input
              type="text"
              className="outline-none w-full dark:placeholder:text-white/70 dark:text-white/70 dark:bg-slate-800 "
              placeholder="Type to search for tools..."
            />
            <MagnifyingGlassIcon className="h-4 w-4 dark:text-white/70 rotate-90" />
          </div>
        </div>

        <MenuRow
          id="id"
          icon={AllToolsSvg}
          label="All tools"
          isLeaf={true}
          isActive
        />
      </div>

      <div className="border-t-2 dark:border-t-white/20 px-2 pt-2">
        {menus.map((item) => (
          <div key={item.id}>
            <MenuRow
              id={item.id}
              icon={item.icon}
              label={item.label}
              isLeaf={false}
              expand={item.expand}
              onClick={clickMenu}
            />
            <div
              className={`pl-12 ${
                item.expand ? 'max-h-screen' : 'max-h-0'
              } overflow-hidden transition-all duration-500 ease-in-out `}
            >
              {item.children?.map((subItem) => (
                <MenuRow
                  key={subItem.id}
                  id={subItem.id}
                  icon={subItem.icon}
                  label={subItem.label}
                  isLeaf
                  expand={false}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Menu;
