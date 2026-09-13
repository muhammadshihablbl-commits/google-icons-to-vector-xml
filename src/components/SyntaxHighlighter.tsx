import React, { useMemo } from 'react';

interface SyntaxHighlighterProps {
  code: string;
  language: 'xml' | 'kotlin';
  isDark: boolean;
  showLineNumbers?: boolean;
}

function highlightXmlLine(line: string, isDark: boolean): React.ReactNode {
  const trimmed = line.trim();
  // Comment line
  if (trimmed.startsWith('<!--') || trimmed.startsWith('*') || trimmed.endsWith('-->')) {
    return <span className={isDark ? 'text-neutral-400 italic' : 'text-neutral-500 italic'}>{line}</span>;
  }

  // Regex to match XML tokens
  const tokenRegex = /(<!--[\s\S]*?-->|<\/?[a-zA-Z0-9_:-]+|\/?>|[a-zA-Z0-9_:-]+=|"[^"]*"|'[^']*'|[^<>"'=]+)/g;
  const matches = line.match(tokenRegex);
  if (!matches) return line;

  return matches.map((token, idx) => {
    if (token.startsWith('<!--')) {
      return (
        <span key={idx} className={isDark ? 'text-neutral-400 italic' : 'text-neutral-500 italic'}>
          {token}
        </span>
      );
    }
    if (token.startsWith('<')) {
      const isClosing = token.startsWith('</');
      const bracket = isClosing ? '</' : '<';
      const tagName = token.slice(bracket.length);
      return (
        <span key={idx}>
          <span className={isDark ? 'text-cyan-400' : 'text-blue-600 font-semibold'}>{bracket}</span>
          <span className={isDark ? 'text-emerald-400 font-semibold' : 'text-emerald-700 font-bold'}>
            {tagName}
          </span>
        </span>
      );
    }
    if (token === '>' || token === '/>') {
      return (
        <span key={idx} className={isDark ? 'text-cyan-400' : 'text-blue-600 font-semibold'}>
          {token}
        </span>
      );
    }
    if (token.endsWith('=')) {
      const attrName = token.slice(0, -1);
      const isAndroid = attrName.startsWith('android:') || attrName.startsWith('xmlns:');
      return (
        <span key={idx}>
          <span
            className={
              isDark
                ? isAndroid
                  ? 'text-sky-300 font-medium'
                  : 'text-amber-300 font-medium'
                : isAndroid
                ? 'text-indigo-700 font-semibold'
                : 'text-amber-800 font-semibold'
            }
          >
            {attrName}
          </span>
          <span className={isDark ? 'text-neutral-400' : 'text-neutral-500'}>=</span>
        </span>
      );
    }
    if (
      (token.startsWith('"') && token.endsWith('"')) ||
      (token.startsWith("'") && token.endsWith("'"))
    ) {
      return (
        <span key={idx} className={isDark ? 'text-amber-200' : 'text-emerald-800'}>
          {token}
        </span>
      );
    }
    return <span key={idx}>{token}</span>;
  });
}

function highlightKotlinLine(line: string, isDark: boolean): React.ReactNode {
  const trimmed = line.trim();
  if (trimmed.startsWith('//')) {
    return <span className={isDark ? 'text-neutral-400 italic' : 'text-neutral-500 italic'}>{line}</span>;
  }

  const tokenRegex = /(\/\/[^\n]*|"[^"]*"|[a-zA-Z0-9_.]+|[^\s\w"]+|\s+)/g;
  const matches = line.match(tokenRegex);
  if (!matches) return line;

  const keywords = new Set(['val', 'var', 'fun', 'import', 'package', 'class', 'object', 'return', 'null', 'true', 'false']);
  const types = new Set(['Icon', 'Modifier', 'R', 'Color', 'Dp', 'Image', 'Painter', 'Composable', 'ImageView']);

  return matches.map((token, idx) => {
    if (token.startsWith('//')) {
      return (
        <span key={idx} className={isDark ? 'text-neutral-400 italic' : 'text-neutral-500 italic'}>
          {token}
        </span>
      );
    }
    if (token.startsWith('"')) {
      return (
        <span key={idx} className={isDark ? 'text-amber-200' : 'text-emerald-800'}>
          {token}
        </span>
      );
    }
    if (keywords.has(token)) {
      return (
        <span key={idx} className={isDark ? 'text-purple-400 font-semibold' : 'text-purple-700 font-bold'}>
          {token}
        </span>
      );
    }
    if (
      types.has(token) ||
      (token.length > 0 && token[0] === token[0].toUpperCase() && token[0] !== token[0].toLowerCase())
    ) {
      return (
        <span key={idx} className={isDark ? 'text-cyan-300 font-semibold' : 'text-blue-700 font-bold'}>
          {token}
        </span>
      );
    }
    if (token.includes('.dp') || token === 'modifier' || token === 'painter' || token === 'contentDescription') {
      return (
        <span key={idx} className={isDark ? 'text-sky-300' : 'text-indigo-600'}>
          {token}
        </span>
      );
    }
    return <span key={idx}>{token}</span>;
  });
}

export const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = ({
  code,
  language,
  isDark,
  showLineNumbers = true,
}) => {
  const lines = useMemo(() => code.split('\n'), [code]);

  return (
    <div
      className={`relative font-mono text-xs leading-relaxed overflow-x-auto rounded-lg transition-colors ${
        isDark ? 'bg-[#0d1117] text-[#c9d1d9]' : 'bg-white text-neutral-800'
      }`}
    >
      <div className="py-2.5 px-3 min-w-full inline-block">
        {lines.map((line, lineIndex) => {
          const highlighted =
            language === 'xml'
              ? highlightXmlLine(line, isDark)
              : highlightKotlinLine(line, isDark);

          return (
            <div key={lineIndex} className="flex items-start hover:bg-black/5 dark:hover:bg-white/5 rounded-xs">
              {showLineNumbers && (
                <span
                  className={`inline-block select-none text-right pr-3.5 shrink-0 text-[11px] font-mono ${
                    isDark ? 'text-neutral-600' : 'text-neutral-400'
                  }`}
                  style={{ width: `${Math.max(2, String(lines.length).length) * 10 + 16}px` }}
                >
                  {lineIndex + 1}
                </span>
              )}
              <span className="whitespace-pre flex-1 font-mono">{highlighted || ' '}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
