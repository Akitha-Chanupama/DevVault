import React from 'react';

export type ToolStatus = 'available' | 'planned';

export type PrivacyMode =
  | 'browser-only'
  | 'external-request'
  | 'server-processing';

export type ToolCategory =
  | 'JSON & Data'
  | 'API & HTTP'
  | 'Security'
  | 'Text & Code'
  | 'Generators'
  | 'Web Development'
  | 'Database'
  | 'Network'
  | 'Time & Date'
  | 'Workspace';

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  keywords: string[];
  route: string;
  status: ToolStatus;
  privacyMode: PrivacyMode;
  icon: string;
  isPopular?: boolean;
  priority?: 'P0' | 'P1' | 'P2';
  component?: React.LazyExoticComponent<React.ComponentType<any>>;
}

