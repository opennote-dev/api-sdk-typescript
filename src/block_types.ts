import { v4 as uuidv4 } from 'uuid';
import { blockToNodeParams, getNodeType } from './block_type_converters';

// Enums for specific types
export enum ChartType {
  BAR = "bar",
  LINE = "line",
  PIE = "pie",
  SCATTER = "scatter",
  AREA = "area"
}

export enum Position {
  BEFORE = "before",
  AFTER = "after"
}

export enum OperationType {
  CREATE_NODE = "create_node",
  UPDATE_NODE = "update_node",
  DELETE_NODE = "delete_node"
}

// Base Block Model
export abstract class BaseBlock {
  id: string;

  constructor() {
    this.id = uuidv4();
  }

  /**
   * Convert this block to a ProseMirror node representation
   * Note: This method should be overridden by the block_type_converters module
   */
  toNode(): Record<string, any> {
    const params = blockToNodeParams(this)
    const node_type = getNodeType(this)
    return {
        "type": node_type,
        "params": params,
        "attrs": {
            "id": this.id
        }
    }
  }
}

// Text and Formatting Blocks
export class ParagraphBlock extends BaseBlock {
  content: string;

  constructor(content: string = "") {
    super();
    this.content = content;
  }
}

export class HeadingBlock extends BaseBlock {
  level: number;
  content: string;

  constructor(level: number, content: string) {
    super();
    if (level < 1 || level > 3) {
      throw new Error("Heading level must be between 1 and 3");
    }
    this.level = level;
    this.content = content;
  }
}

// List Blocks
export class ListItemBlock extends BaseBlock {
  content: string | ParagraphBlock | any[];

  constructor(content: string | ParagraphBlock | any[]) {
    super();
    this.content = content;
  }
}

export class BulletListBlock extends BaseBlock {
  items: ListItemBlock[];

  constructor(items: ListItemBlock[]) {
    super();
    this.items = items;
  }
}

export class OrderedListBlock extends BaseBlock {
  items: ListItemBlock[];
  start: number;

  constructor(items: ListItemBlock[], start: number = 1) {
    super();
    this.items = items;
    this.start = start;
  }
}

// Content Blocks
export class BlockquoteBlock extends BaseBlock {
  content: string | any[];

  constructor(content: string | any[]) {
    super();
    this.content = content;
  }
}

export class HorizontalRuleBlock extends BaseBlock {
  constructor() {
    super();
  }
}

export class HardBreakBlock extends BaseBlock {
  constructor() {
    super();
  }
}

// Code Blocks
export class CustomCodeBlock extends BaseBlock {
  code: string;
  language: string;

  constructor(code: string, language: string = "python") {
    super();
    this.code = code;
    this.language = language;
  }
}

// LaTeX/Math Blocks
export class LatexBlock extends BaseBlock {
  latex: string;

  constructor(latex: string) {
    super();
    this.latex = latex;
  }
}

export class InlineLatexBlock extends BaseBlock {
  latex: string;

  constructor(latex: string) {
    super();
    this.latex = latex;
  }
}

// Media Blocks
export class ImageBlock extends BaseBlock {
  src: string;
  alt?: string;
  width?: number;
  height?: number;

  constructor(src: string, alt: string = "", width?: number, height?: number) {
    super();
    this.src = src;
    this.alt = alt;
    this.width = width;
    this.height = height;
  }
}

export class VideoBlock extends BaseBlock {
  src: string;
  width?: number;
  height?: number;

  constructor(src: string, width?: number, height?: number) {
    super();
    this.src = src;
    this.width = width;
    this.height = height;
  }
}

export class AudioBlock extends BaseBlock {
  src: string;
  title?: string;

  constructor(src: string, title?: string) {
    super();
    this.src = src;
    this.title = title;
  }
}

export class YoutubeBlock extends BaseBlock {
  src: string;
  width: number;
  height: number;

  constructor(src: string, width: number = 640, height: number = 480) {
    super();
    this.src = src;
    this.width = width;
    this.height = height;
  }
}

export class PDFBlock extends BaseBlock {
  src: string;
  width?: number;
  height?: number;

  constructor(src: string, width?: number, height?: number) {
    super();
    this.src = src;
    this.width = width;
    this.height = height;
  }
}

export class DOCXBlock extends BaseBlock {
  src: string;
  width?: number;
  height?: number;

  constructor(src: string, width?: number, height?: number) {
    super();
    this.src = src;
    this.width = width;
    this.height = height;
  }
}

// Interactive Blocks
export class DesmosBlock extends BaseBlock {
  equations: string;

  constructor(equations: string = "[y=x]") {
    super();
    this.equations = equations;
  }
}

export class ChartBlock extends BaseBlock {
  chartType: ChartType;
  title: string;
  data?: Record<string, any>;

  constructor(chartType: ChartType = ChartType.BAR, title: string = "Chart Title", data?: Record<string, any>) {
    super();
    this.chartType = chartType;
    this.title = title;
    this.data = data;
  }
}

// Special Elements
export class MentionBlock extends BaseBlock {
  label: string;

  constructor(id: string, label: string) {
    super();
    this.id = id; // Override the auto-generated ID
    this.label = label;
  }
}

export class EmojiBlock extends BaseBlock {
  name: string;

  constructor(name: string) {
    super();
    this.name = name;
  }
}

export class JournalLinkBlock extends BaseBlock {
  journalId: string;
  title: string;

  constructor(journalId: string, title: string = "New Journal") {
    super();
    this.journalId = journalId;
    this.title = title;
  }
}

export class AICompletionBlock extends BaseBlock {
  old: string;
  new: string;
  complete: boolean;

  constructor(old: string, newText: string, complete: boolean = false) {
    super();
    this.old = old;
    this.new = newText;
    this.complete = complete;
  }
}

// Set Blocks
export class FlashcardSetBlock extends BaseBlock {
  setName: string;
  flashcards: Record<string, any>[];
  description: string;

  constructor(setName: string, flashcards: Record<string, any>[] = [], description: string = "") {
    super();
    this.setName = setName;
    this.flashcards = flashcards;
    this.description = description;
  }
}

export class PracticeProblemSetBlock extends BaseBlock {
  setName: string;
  problems: Record<string, any>[];
  description: string;

  constructor(setName: string, problems: Record<string, any>[] = [], description: string = "") {
    super();
    this.setName = setName;
    this.problems = problems;
    this.description = description;
  }
}

// Table Blocks
export class TableCellBlock extends BaseBlock {
  content: any;
  colspan?: number;
  rowspan?: number;

  constructor(content: any, colspan: number = 1, rowspan: number = 1) {
    super();
    this.content = content;
    this.colspan = colspan;
    this.rowspan = rowspan;
  }
}

export class TableHeaderBlock extends BaseBlock {
  content: any;
  colspan?: number;
  rowspan?: number;

  constructor(content: any, colspan: number = 1, rowspan: number = 1) {
    super();
    this.content = content;
    this.colspan = colspan;
    this.rowspan = rowspan;
  }
}

export class TableRowBlock extends BaseBlock {
  cells: (TableCellBlock | TableHeaderBlock)[];

  constructor(cells: (TableCellBlock | TableHeaderBlock)[]) {
    super();
    this.cells = cells;
  }
}

export class TableBlock extends BaseBlock {
  rows: TableRowBlock[];

  constructor(rows: TableRowBlock[]) {
    super();
    this.rows = rows;
  }
}

// Details/Accordion Blocks
export class DetailsSummaryBlock extends BaseBlock {
  text: string;

  constructor(text: string) {
    super();
    this.text = text;
  }
}

export class DetailsContentBlock extends BaseBlock {
  content: any[];

  constructor(content: any[]) {
    super();
    this.content = content;
  }
}

export class DetailsBlock extends BaseBlock {
  summary: DetailsSummaryBlock;
  content: DetailsContentBlock;
  open: boolean;

  constructor(summary: DetailsSummaryBlock, content: DetailsContentBlock, open: boolean = false) {
    super();
    this.summary = summary;
    this.content = content;
    this.open = open;
  }
}