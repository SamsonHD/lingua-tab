import React, { useState } from "react";
import { Tooltip } from "./ui/tooltip";
import { shaders } from "./util/shaders";
import { ShaderPreviewButton } from "./ShaderPreviewButton";
import { speakWord, SupportedLangCode } from "../utils/tts";
import { WordEntry } from "./LanguageManager";

interface ShaderSelectorProps {
  selectedShader: number;
  onSelectShader: (id: number) => void;
  currentWord?: WordEntry;
  currentLanguage?: string;
}

export const ShaderSelector = ({ 
  selectedShader, 
  onSelectShader, 
  currentWord, 
  currentLanguage 
}: ShaderSelectorProps) => {
  const [hoveredShader, setHoveredShader] = useState(null as number | null);

  const handleShaderSelect = async (shaderId: number) => {
    // Play TTS when clicking shader
    if (currentWord && currentLanguage) {
      // Map display name to language code for Web Speech API
      const languageMap: Record<string, any> = {
        Spanish: 'es',
        French: 'fr',
        German: 'de',
        Italian: 'it',
        Japanese: 'ja',
        Portuguese: 'pt',
        Ukrainian: 'uk',
      };
      const code = languageMap[currentLanguage] || 'en';
      
      // Extract only the first word (before any transliteration or additional info)
      const firstWord = currentWord.word.split(/[\s(]/)[0].trim();
      
      try {
        await speakWord(firstWord, code as SupportedLangCode, { rate: 0.8 });
      } catch (e) {
        console.warn('Speech synthesis failed:', e);
      }
    }
    
    // Then select the shader
    onSelectShader(shaderId);
  };

  return (
    <div className="fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-3 z-10">
      {shaders.map((shader) => (
        <Tooltip key={shader.id} content={shader.name} side="left">
          <div className={`${hoveredShader && hoveredShader !== shader.id ? 'opacity-60' : 'opacity-100'}`}>
            <ShaderPreviewButton
              shaderId={shader.id}
              isSelected={selectedShader === shader.id}
              onSelect={() => handleShaderSelect(shader.id)}
              onMouseEnter={() => setHoveredShader(shader.id)}
              onMouseLeave={() => setHoveredShader(null)}
            />
          </div>
        </Tooltip>
      ))}
    </div>
  );
};