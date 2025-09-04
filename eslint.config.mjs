// eslint.config.mjs
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  // Next 권장 설정 + TypeScript 권장 설정
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  // 추가 규칙(필요 시 완화; 배포 급하면 아래 두 줄 정도는 임시로 켜도 됨)
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'react-hooks/rules-of-hooks': 'error', // 이건 유지 권장(진짜 오류 방지)
    },
  },
];