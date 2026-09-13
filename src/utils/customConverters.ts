/**
 * Utilities for:
 * 1. Custom SVG to Android VectorDrawable XML conversion
 * 2. Reverse Android VectorDrawable XML to SVG visual parsing & rendering
 */

export interface ParsedVectorXml {
  viewportWidth: number;
  viewportHeight: number;
  widthDp: number;
  heightDp: number;
  tint?: string;
  alpha?: number;
  svgMarkup: string;
  paths: Array<{
    pathData: string;
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    fillAlpha?: number;
    strokeAlpha?: number;
  }>;
  errors: string[];
}

/**
 * Converts Android 8-digit Hex color (#AARRGGBB) to CSS rgba/hex
 */
export function androidColorToCss(colorStr?: string): { color: string; opacity?: number } {
  if (!colorStr) return { color: '#000000' };

  const trimmed = colorStr.trim();

  // Android #AARRGGBB
  if (/^#[0-9a-fA-F]{8}$/.test(trimmed)) {
    const alphaHex = trimmed.slice(1, 3);
    const rgbHex = trimmed.slice(3);
    const alpha = parseInt(alphaHex, 16) / 255;
    return {
      color: `#${rgbHex}`,
      opacity: Math.round(alpha * 100) / 100,
    };
  }

  // Standard #RRGGBB or #RGB
  if (/^#[0-9a-fA-F]{3,6}$/.test(trimmed)) {
    return { color: trimmed };
  }

  // Named colors or references (@color/...)
  if (trimmed.startsWith('@color/') || trimmed.startsWith('?attr/')) {
    return { color: '#1976D2' }; // sensible fallback for Android theme references
  }

  return { color: trimmed };
}

/**
 * Converts standard CSS hex (#RRGGBB) to Android 8-digit hex (#AARRGGBB)
 */
export function cssColorToAndroid(hex: string, alpha: number = 1): string {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  const alphaInt = Math.min(Math.max(Math.round(alpha * 255), 0), 255);
  const alphaHex = alphaInt.toString(16).padStart(2, '0').toUpperCase();
  return `#${alphaHex}${clean.toUpperCase()}`;
}

/**
 * Parses an Android VectorDrawable XML and produces a standard SVG markup string and metadata
 */
export function parseVectorXmlToSvg(xmlContent: string): ParsedVectorXml {
  const errors: string[] = [];

  if (!xmlContent || !xmlContent.includes('<vector')) {
    return {
      viewportWidth: 24,
      viewportHeight: 24,
      widthDp: 24,
      heightDp: 24,
      svgMarkup: '',
      paths: [],
      errors: ['The provided text is not a valid Android <vector> XML document.'],
    };
  }

  // Extract root vector attributes
  const viewportWidthMatch = xmlContent.match(/android:viewportWidth=["']([^"']+)["']/);
  const viewportHeightMatch = xmlContent.match(/android:viewportHeight=["']([^"']+)["']/);
  const widthMatch = xmlContent.match(/android:width=["']([^"']+)["']/);
  const heightMatch = xmlContent.match(/android:height=["']([^"']+)["']/);
  const tintMatch = xmlContent.match(/android:tint=["']([^"']+)["']/);
  const alphaMatch = xmlContent.match(/android:alpha=["']([^"']+)["']/);

  const viewportWidth = viewportWidthMatch ? parseFloat(viewportWidthMatch[1]) || 24 : 24;
  const viewportHeight = viewportHeightMatch ? parseFloat(viewportHeightMatch[1]) || 24 : 24;
  const widthDp = widthMatch ? parseFloat(widthMatch[1].replace(/[^0-9.]/g, '')) || 24 : 24;
  const heightDp = heightMatch ? parseFloat(heightMatch[1].replace(/[^0-9.]/g, '')) || 24 : 24;
  const tint = tintMatch ? tintMatch[1] : undefined;
  const alpha = alphaMatch ? parseFloat(alphaMatch[1]) : undefined;

  // Extract all <path> elements
  const pathRegex = /<path\b([^>]*)\/?>/gi;
  const paths: Array<{
    pathData: string;
    fillColor?: string;
    strokeColor?: string;
    strokeWidth?: number;
    fillAlpha?: number;
    strokeAlpha?: number;
  }> = [];

  let match: RegExpExecArray | null;
  while ((match = pathRegex.exec(xmlContent)) !== null) {
    const attrsStr = match[1];

    const dataMatch = attrsStr.match(/android:pathData=["']([^"']+)["']/);
    if (!dataMatch || !dataMatch[1].trim()) continue;

    const fillMatch = attrsStr.match(/android:fillColor=["']([^"']+)["']/);
    const strokeMatch = attrsStr.match(/android:strokeColor=["']([^"']+)["']/);
    const strokeWidthMatch = attrsStr.match(/android:strokeWidth=["']([^"']+)["']/);
    const fillAlphaMatch = attrsStr.match(/android:fillAlpha=["']([^"']+)["']/);
    const strokeAlphaMatch = attrsStr.match(/android:strokeAlpha=["']([^"']+)["']/);

    paths.push({
      pathData: dataMatch[1].trim(),
      fillColor: fillMatch ? fillMatch[1] : undefined,
      strokeColor: strokeMatch ? strokeMatch[1] : undefined,
      strokeWidth: strokeWidthMatch ? parseFloat(strokeWidthMatch[1]) : undefined,
      fillAlpha: fillAlphaMatch ? parseFloat(fillAlphaMatch[1]) : undefined,
      strokeAlpha: strokeAlphaMatch ? parseFloat(strokeAlphaMatch[1]) : undefined,
    });
  }

  // Also check for <group> translation/rotation/scale
  // For basic groups, we can check if there are groups with translation
  const groupMatches = xmlContent.matchAll(/<group\b([^>]*)>([\s\S]*?)<\/group>/gi);
  const groupElements: string[] = [];

  for (const g of groupMatches) {
    const gAttrs = g[1];
    const gBody = g[2];

    const txMatch = gAttrs.match(/android:translateX=["']([^"']+)["']/);
    const tyMatch = gAttrs.match(/android:translateY=["']([^"']+)["']/);
    const sxMatch = gAttrs.match(/android:scaleX=["']([^"']+)["']/);
    const syMatch = gAttrs.match(/android:scaleY=["']([^"']+)["']/);
    const rMatch = gAttrs.match(/android:rotation=["']([^"']+)["']/);

    const transforms: string[] = [];
    if (txMatch || tyMatch) {
      const tx = txMatch ? txMatch[1] : '0';
      const ty = tyMatch ? tyMatch[1] : '0';
      transforms.push(`translate(${tx}, ${ty})`);
    }
    if (sxMatch || syMatch) {
      const sx = sxMatch ? sxMatch[1] : '1';
      const sy = syMatch ? syMatch[1] : '1';
      transforms.push(`scale(${sx}, ${sy})`);
    }
    if (rMatch) {
      transforms.push(`rotate(${rMatch[1]})`);
    }

    const transformAttr = transforms.length > 0 ? ` transform="${transforms.join(' ')}"` : '';

    // Extract paths inside group
    const innerPathMatches = gBody.matchAll(/<path\b([^>]*)\/?>/gi);
    const innerSvgPaths: string[] = [];
    for (const ip of innerPathMatches) {
      const attrsStr = ip[1];
      const dataMatch = attrsStr.match(/android:pathData=["']([^"']+)["']/);
      if (!dataMatch) continue;

      const fillMatch = attrsStr.match(/android:fillColor=["']([^"']+)["']/);
      const strokeMatch = attrsStr.match(/android:strokeColor=["']([^"']+)["']/);
      const strokeWidthMatch = attrsStr.match(/android:strokeWidth=["']([^"']+)["']/);

      const parsedFill = androidColorToCss(fillMatch ? fillMatch[1] : '#000000');
      const fillProp = fillMatch ? `fill="${parsedFill.color}"` : 'fill="#000000"';
      const fillOpacity = parsedFill.opacity !== undefined ? ` fill-opacity="${parsedFill.opacity}"` : '';

      let strokeProps = '';
      if (strokeMatch) {
        const parsedStroke = androidColorToCss(strokeMatch[1]);
        strokeProps = ` stroke="${parsedStroke.color}" stroke-width="${strokeWidthMatch ? strokeWidthMatch[1] : '1'}"`;
      }

      innerSvgPaths.push(
        `<path d="${dataMatch[1]}" ${fillProp}${fillOpacity}${strokeProps} />`
      );
    }

    if (innerSvgPaths.length > 0) {
      groupElements.push(`<g${transformAttr}>\n  ${innerSvgPaths.join('\n  ')}\n</g>`);
    }
  }

  // Build SVG path elements if no groups, or combine
  let svgInnerContent = '';
  if (groupElements.length > 0) {
    svgInnerContent = groupElements.join('\n');
  } else if (paths.length > 0) {
    svgInnerContent = paths
      .map((p) => {
        const parsedFill = androidColorToCss(p.fillColor || '#000000');
        const fillProp = p.fillColor ? `fill="${parsedFill.color}"` : 'fill="#000000"';
        const fillOpacity =
          p.fillAlpha !== undefined
            ? ` fill-opacity="${p.fillAlpha}"`
            : parsedFill.opacity !== undefined
            ? ` fill-opacity="${parsedFill.opacity}"`
            : '';

        let strokeProps = '';
        if (p.strokeColor) {
          const parsedStroke = androidColorToCss(p.strokeColor);
          strokeProps = ` stroke="${parsedStroke.color}" stroke-width="${p.strokeWidth || 1}"`;
          if (p.strokeAlpha !== undefined) {
            strokeProps += ` stroke-opacity="${p.strokeAlpha}"`;
          }
        }

        return `<path d="${p.pathData}" ${fillProp}${fillOpacity}${strokeProps} />`;
      })
      .join('\n  ');
  } else {
    errors.push('No valid <path android:pathData="..."> found in this Vector XML.');
  }

  const svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewportWidth} ${viewportHeight}" width="100%" height="100%">
  ${svgInnerContent}
</svg>`;

  return {
    viewportWidth,
    viewportHeight,
    widthDp,
    heightDp,
    tint,
    alpha,
    svgMarkup,
    paths,
    errors,
  };
}

/**
 * Converts standard geometric SVG elements (circle, rect, line, polygon) to path data
 */
export function shapeElementToPathData(elem: Element): string | null {
  const tag = elem.tagName.toLowerCase();

  if (tag === 'path') {
    return elem.getAttribute('d') || null;
  }

  if (tag === 'rect') {
    const x = parseFloat(elem.getAttribute('x') || '0') || 0;
    const y = parseFloat(elem.getAttribute('y') || '0') || 0;
    const w = parseFloat(elem.getAttribute('width') || '0') || 0;
    const h = parseFloat(elem.getAttribute('height') || '0') || 0;
    const rx = parseFloat(elem.getAttribute('rx') || '0') || 0;
    const ry = parseFloat(elem.getAttribute('ry') || '0') || 0;

    if (w <= 0 || h <= 0) return null;

    if (rx > 0 || ry > 0) {
      const r = Math.min(rx || ry, w / 2, h / 2);
      return `M ${x + r} ${y} L ${x + w - r} ${y} A ${r} ${r} 0 0 1 ${x + w} ${y + r} L ${x + w} ${y + h - r} A ${r} ${r} 0 0 1 ${x + w - r} ${y + h} L ${x + r} ${y + h} A ${r} ${r} 0 0 1 ${x} ${y + h - r} L ${x} ${y + r} A ${r} ${r} 0 0 1 ${x + r} ${y} Z`;
    }

    return `M ${x} ${y} L ${x + w} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z`;
  }

  if (tag === 'circle') {
    const cx = parseFloat(elem.getAttribute('cx') || '0') || 0;
    const cy = parseFloat(elem.getAttribute('cy') || '0') || 0;
    const r = parseFloat(elem.getAttribute('r') || '0') || 0;
    if (r <= 0) return null;
    return `M ${cx - r}, ${cy} a ${r},${r} 0 1,0 ${r * 2},0 a ${r},${r} 0 1,0 -${r * 2},0`;
  }

  if (tag === 'line') {
    const x1 = elem.getAttribute('x1') || '0';
    const y1 = elem.getAttribute('y1') || '0';
    const x2 = elem.getAttribute('x2') || '0';
    const y2 = elem.getAttribute('y2') || '0';
    return `M ${x1} ${y1} L ${x2} ${y2}`;
  }

  if (tag === 'polygon' || tag === 'polyline') {
    const points = (elem.getAttribute('points') || '').trim();
    if (!points) return null;
    const coords = points.split(/[\s,]+/).filter(Boolean);
    if (coords.length < 4) return null;

    let path = `M ${coords[0]} ${coords[1]}`;
    for (let i = 2; i < coords.length; i += 2) {
      if (coords[i + 1] !== undefined) {
        path += ` L ${coords[i]} ${coords[i + 1]}`;
      }
    }
    if (tag === 'polygon') path += ' Z';
    return path;
  }

  return null;
}

export interface CustomSvgConversionResult {
  vectorXml: string;
  viewportWidth: number;
  viewportHeight: number;
  pathsCount: number;
  cleanedSvg: string;
  errors: string[];
}

/**
 * Converts arbitrary user SVG text to Android Vector XML
 */
export function convertSvgToVectorXml(
  svgContent: string,
  options: {
    drawableName?: string;
    widthDp?: number;
    heightDp?: number;
    fillColor?: string;
    preserveColors?: boolean;
    tint?: string;
  } = {}
): CustomSvgConversionResult {
  const errors: string[] = [];

  if (!svgContent || !svgContent.includes('<svg')) {
    return {
      vectorXml: '',
      viewportWidth: 24,
      viewportHeight: 24,
      pathsCount: 0,
      cleanedSvg: '',
      errors: ['Input does not contain a valid <svg> element.'],
    };
  }

  let doc: Document;
  try {
    const parser = new DOMParser();
    doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const parserError = doc.querySelector('parsererror');
    if (parserError) {
      errors.push('SVG XML parsing error: ' + (parserError.textContent || 'Syntax error'));
    }
  } catch (e: any) {
    errors.push('Failed to parse SVG: ' + e.message);
    return {
      vectorXml: '',
      viewportWidth: 24,
      viewportHeight: 24,
      pathsCount: 0,
      cleanedSvg: '',
      errors,
    };
  }

  const svgElem = doc.querySelector('svg');
  if (!svgElem) {
    return {
      vectorXml: '',
      viewportWidth: 24,
      viewportHeight: 24,
      pathsCount: 0,
      cleanedSvg: '',
      errors: ['No <svg> root element found.'],
    };
  }

  // Parse viewBox or width/height
  let minX = 0;
  let minY = 0;
  let viewportWidth = 24;
  let viewportHeight = 24;

  const viewBox = svgElem.getAttribute('viewBox');
  if (viewBox) {
    const parts = viewBox.trim().split(/[\s,]+/).map(Number);
    if (parts.length === 4 && !parts.some(isNaN)) {
      minX = parts[0];
      minY = parts[1];
      viewportWidth = parts[2];
      viewportHeight = parts[3];
    }
  } else {
    const w = parseFloat(svgElem.getAttribute('width') || '24') || 24;
    const h = parseFloat(svgElem.getAttribute('height') || '24') || 24;
    viewportWidth = w;
    viewportHeight = h;
  }

  const widthDp = options.widthDp || Math.round(viewportWidth > 0 && viewportWidth <= 96 ? viewportWidth : 24);
  const heightDp = options.heightDp || Math.round(viewportHeight > 0 && viewportHeight <= 96 ? viewportHeight : 24);
  const defaultFill = options.fillColor || '#FF000000';

  // Extract all drawable shapes
  const shapeElements = svgElem.querySelectorAll('path, rect, circle, line, polygon, polyline');
  const pathXmlEntries: string[] = [];

  shapeElements.forEach((elem) => {
    const pathData = shapeElementToPathData(elem);
    if (!pathData) return;

    // Color extraction
    let fill = defaultFill;
    if (options.preserveColors) {
      const elemFill = elem.getAttribute('fill');
      if (elemFill && elemFill !== 'none' && elemFill !== 'currentColor') {
        fill = cssColorToAndroid(elemFill);
      }
    }

    const stroke = elem.getAttribute('stroke');
    const strokeWidth = elem.getAttribute('stroke-width');

    let strokeAttrs = '';
    if (stroke && stroke !== 'none') {
      const androidStroke = cssColorToAndroid(stroke);
      strokeAttrs = `\n        android:strokeColor="${androidStroke}"`;
      if (strokeWidth) {
        strokeAttrs += `\n        android:strokeWidth="${parseFloat(strokeWidth) || 1}"`;
      }
    }

    const fillAttr = elem.getAttribute('fill') === 'none' && stroke ? '' : `\n        android:fillColor="${fill}"`;

    pathXmlEntries.push(`    <path${fillAttr}${strokeAttrs}
        android:pathData="${pathData.trim()}" />`);
  });

  const drawableName = options.drawableName || 'ic_custom';
  const tintAttr = options.tint ? `\n    android:tint="${options.tint}"` : '';

  let groupOpen = '';
  let groupClose = '';
  if (minX !== 0 || minY !== 0) {
    const tx = -minX;
    const ty = -minY;
    groupOpen = `    <group android:translateX="${tx}" android:translateY="${ty}">\n`;
    groupClose = `\n    </group>`;
  }

  const vectorXml = `<!--
  Custom Android VectorDrawable
  Name: ${drawableName}
  Converted by Google Icons to Vector XML Tool
-->
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="${widthDp}dp"
    android:height="${heightDp}dp"
    android:viewportWidth="${viewportWidth}"
    android:viewportHeight="${viewportHeight}"${tintAttr}>
${groupOpen}${pathXmlEntries.join('\n')}${groupClose}
</vector>`.trim();

  // Create clean SVG for preview
  const cleanedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${minX} ${minY} ${viewportWidth} ${viewportHeight}" width="100%" height="100%">
  ${Array.from(shapeElements)
    .map((e) => e.outerHTML)
    .join('\n  ')}
</svg>`;

  return {
    vectorXml,
    viewportWidth,
    viewportHeight,
    pathsCount: pathXmlEntries.length,
    cleanedSvg,
    errors,
  };
}
