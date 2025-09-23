/**
 * Editor operations helper functions for interacting with the Opennote API.
 * This module provides utilities to create operations that work with the editor API.
 */

import {
  BaseBlock,
  ParagraphBlock,
  HeadingBlock,
  TextBlock,
  BulletListBlock,
  OrderedListBlock,
  ListItemBlock,
  BlockquoteBlock,
  HorizontalRuleBlock,
  HardBreakBlock,
  CustomCodeBlock,
  LatexBlock,
  InlineLatexBlock,
  ImageBlock,
  VideoBlock,
  AudioBlock,
  YoutubeBlock,
  PDFBlock,
  DOCXBlock,
  WhiteboardBlock,
  DesmosBlock,
  ChartBlock,
  MentionBlock,
  EmojiBlock,
  JournalLinkBlock,
  AICompletionBlock,
  FlashcardSetBlock,
  PracticeProblemSetBlock,
  TableBlock,
  TableRowBlock,
  TableCellBlock,
  TableHeaderBlock,
  DetailsBlock,
  DetailsSummaryBlock,
  DetailsContentBlock,
  Position
} from './block_types';

import {
  CreateNodeOperation,
  UpdateNodeOperation,
  DeleteNodeOperation,
} from './api_types';

/**
 * Convert a block to parameters array for NodeCreators functions.
 * Based on the TypeScript NodeCreators implementation.
 */
export function blockToNodeParams(block: BaseBlock): any[] {
  // Map block types to their parameter arrays
  if (block instanceof ParagraphBlock) {
    // paragraph: (content?: Fragment | string, attrs?: Record<string, any>)
    return block.content ? [block.content] : [""];
  }
  
  else if (block instanceof HeadingBlock) {
    // heading: (level: number, content: Fragment | string, attrs?: Record<string, any>)
    return [block.level, block.content];
  }
  
  else if (block instanceof TextBlock) {
    // text: (text: string, marks?: Mark[])
    return block.marks ? [block.text, block.marks] : [block.text];
  }
  
  else if (block instanceof BulletListBlock) {
    // bulletList: (items: ProseMirrorNode[], attrs?: Record<string, any>)
    const items = block.items.map(item => listItemToNode(item));
    return [items];
  }
  
  else if (block instanceof OrderedListBlock) {
    // orderedList: (items: ProseMirrorNode[], start: number = 1, attrs?: Record<string, any>)
    const items = block.items.map(item => listItemToNode(item));
    return [items, block.start];
  }
  
  else if (block instanceof ListItemBlock) {
    // listItem: (content: ProseMirrorNode | Fragment, attrs?: Record<string, any>)
    const content = blockContentToNode(block.content);
    return [content];
  }
  
  else if (block instanceof BlockquoteBlock) {
    // blockquote: (content: Fragment | ProseMirrorNode[], attrs?: Record<string, any>)
    const content = blockContentToNode(block.content);
    return [content];
  }
  
  else if (block instanceof HorizontalRuleBlock) {
    // horizontalRule: (attrs?: Record<string, any>)
    return [];
  }
  
  else if (block instanceof HardBreakBlock) {
    // hardBreak: ()
    return [];
  }
  
  else if (block instanceof CustomCodeBlock) {
    // customCodeBlock: (code: string, language: string = 'javascript', attrs?: Record<string, any>)
    return [block.code, block.language];
  }
  
  else if (block instanceof LatexBlock) {
    // latex: (latex: string, attrs?: Record<string, any>)
    return [block.latex];
  }
  
  else if (block instanceof InlineLatexBlock) {
    // inlineLatex: (latex: string, attrs?: Record<string, any>)
    return [block.latex];
  }
  
  else if (block instanceof ImageBlock) {
    // image: (src: string, alt?: string, attrs?: Record<string, any>)
    const params = [block.src];
    if (block.alt !== undefined) {
      params.push(block.alt);
    }
    return params;
  }
  
  else if (block instanceof VideoBlock) {
    // video: (src: string, attrs?: Record<string, any>)
    return [block.src];
  }
  
  else if (block instanceof AudioBlock) {
    // audio: (src: string, title?: string, attrs?: Record<string, any>)
    const params = [block.src];
    if (block.title !== undefined) {
      params.push(block.title);
    }
    return params;
  }
  
  else if (block instanceof YoutubeBlock) {
    // youtube: (src: string, width: number = 640, height: number = 480, attrs?: Record<string, any>)
    return [block.src, block.width, block.height];
  }
  
  else if (block instanceof PDFBlock) {
    // pdf: (src: string, width?: number, height?: number, attrs?: Record<string, any>)
    const params: any[] = [block.src];
    if (block.width !== undefined) {
      params.push(block.width);
    }
    if (block.height !== undefined) {
      params.push(block.height);
    }
    return params;
  }
  
  else if (block instanceof DOCXBlock) {
    // docx: (src: string, width?: number, height?: number, attrs?: Record<string, any>)
    const params: any[] = [block.src];
    if (block.width !== undefined) {
      params.push(block.width);
    }
    if (block.height !== undefined) {
      params.push(block.height);
    }
    return params;
  }
  
  else if (block instanceof WhiteboardBlock) {
    // whiteboard: (state: string = '', attrs?: Record<string, any>)
    return [block.state];
  }
  
  else if (block instanceof DesmosBlock) {
    // desmos: (equations: string = '', attrs?: Record<string, any>)
    return [block.equations];
  }
  
  else if (block instanceof ChartBlock) {
    // chart: (chartType: string = 'bar', title: string = 'Chart Title', attrs?: Record<string, any>)
    return [block.chartType, block.title];
  }
  
  else if (block instanceof MentionBlock) {
    // mention: (id: string, label: string)
    return [block.id, block.label];
  }
  
  else if (block instanceof EmojiBlock) {
    // emoji: (name: string)
    return [block.name];
  }
  
  else if (block instanceof JournalLinkBlock) {
    // journalLink: (journalId: string, title: string = 'New Journal', attrs?: Record<string, any>)
    return [block.journalId, block.title];
  }
  
  else if (block instanceof AICompletionBlock) {
    // aiCompletion: (old: string, newText: string, complete: boolean = false, attrs?: Record<string, any>)
    return [block.old, block.new, block.complete];
  }
  
  else if (block instanceof FlashcardSetBlock) {
    // flashcardSet: (setName: string, flashcards: any[] = [], description: string = '', attrs?: Record<string, any>)
    return [block.setName, block.flashcards, block.description];
  }
  
  else if (block instanceof PracticeProblemSetBlock) {
    // practiceProblemSet: (setName: string, problems: any[] = [], description: string = '', attrs?: Record<string, any>)
    return [block.setName, block.problems, block.description];
  }
  
  else if (block instanceof TableBlock) {
    // table: (rows: ProseMirrorNode[], attrs?: Record<string, any>)
    const rows = block.rows.map(row => tableRowToNode(row));
    return [rows];
  }
  
  else if (block instanceof TableRowBlock) {
    // tableRow: (cells: ProseMirrorNode[], attrs?: Record<string, any>)
    const cells = block.cells.map(cell => tableCellToNode(cell));
    return [cells];
  }
  
  else if (block instanceof TableCellBlock) {
    // tableCell: (content: ProseMirrorNode | Fragment, attrs?: Record<string, any>)
    const content = blockContentToNode(block.content);
    return [content];
  }
  
  else if (block instanceof TableHeaderBlock) {
    // tableHeader: (content: ProseMirrorNode | Fragment, attrs?: Record<string, any>)
    const content = blockContentToNode(block.content);
    return [content];
  }
  
  else if (block instanceof DetailsBlock) {
    // details: (summary: ProseMirrorNode, content: ProseMirrorNode, open: boolean = false, attrs?: Record<string, any>)
    const summaryNode = detailsSummaryToNode(block.summary);
    const contentNode = detailsContentToNode(block.content);
    return [summaryNode, contentNode, block.open];
  }
  
  else if (block instanceof DetailsSummaryBlock) {
    // detailsSummary: (text: string, attrs?: Record<string, any>)
    return [block.text];
  }
  
  else if (block instanceof DetailsContentBlock) {
    // detailsContent: (content: ProseMirrorNode[], attrs?: Record<string, any>)
    const content = block.content.map(item => blockContentToNode(item));
    return [content];
  }
  
  // Default fallback
  return [];
}

/**
 * Get the ProseMirror node type string for a block.
 */
export function getNodeType(block: BaseBlock): string {
  const typeMap = new Map<any, string>([
    [ParagraphBlock, "paragraph"],
    [HeadingBlock, "heading"],
    [TextBlock, "text"],
    [BulletListBlock, "bulletList"],
    [OrderedListBlock, "orderedList"],
    [ListItemBlock, "listItem"],
    [BlockquoteBlock, "blockquote"],
    [HorizontalRuleBlock, "horizontalRule"],
    [HardBreakBlock, "hardBreak"],
    [CustomCodeBlock, "customCodeBlock"],
    [LatexBlock, "latex"],
    [InlineLatexBlock, "inlineLatex"],
    [ImageBlock, "image"],
    [VideoBlock, "video"],
    [AudioBlock, "audio"],
    [YoutubeBlock, "youtube"],
    [PDFBlock, "pdf"],
    [DOCXBlock, "docx"],
    [WhiteboardBlock, "whiteboard"],
    [DesmosBlock, "desmos"],
    [ChartBlock, "chart"],
    [MentionBlock, "mention"],
    [EmojiBlock, "emoji"],
    [JournalLinkBlock, "journalLink"],
    [AICompletionBlock, "aiCompletion"],
    [FlashcardSetBlock, "flashcardSet"],
    [PracticeProblemSetBlock, "practiceProblemSet"],
    [TableBlock, "table"],
    [TableRowBlock, "tableRow"],
    [TableCellBlock, "tableCell"],
    [TableHeaderBlock, "tableHeader"],
    [DetailsBlock, "details"],
    [DetailsSummaryBlock, "detailsSummary"],
    [DetailsContentBlock, "detailsContent"],
  ]);
  
  for (const [blockClass, nodeType] of typeMap) {
    if (block instanceof blockClass) {
      return nodeType;
    }
  }
  
  return "paragraph"; // Default fallback
}

/**
 * Create a create_node operation from a block.
 */
export function createNodeOperation(
  block: BaseBlock,
  referenceId?: string,
  position: Position | string = Position.AFTER
): CreateNodeOperation {
  const nodeType = getNodeType(block);
  const params = blockToNodeParams(block);
  
  return {
    type: "create_node",
    nodeType: nodeType,
    params: params,
    referenceId: referenceId,
    position: typeof position === 'string' ? position as "before" | "after" : position as "before" | "after"
  };
}

/**
 * Create an update_node operation that replaces an entire node.
 */
export function updateNodeOperation(
  nodeId: string,
  node: Record<string, any>
): UpdateNodeOperation {
  return {
    type: "update_node",
    nodeId: nodeId,
    node: node
  };
}

/**
 * Create a delete_node operation.
 */
export function deleteNodeOperation(nodeId: string): DeleteNodeOperation {
  return {
    type: "delete_node",
    nodeId: nodeId
  };
}

/**
 * Convert a block to a ProseMirror node representation.
 * This is the standalone version that doesn't rely on the block's method.
 */
export function blockToNode(block: BaseBlock): Record<string, any> {
  const nodeType = getNodeType(block);
  const params = blockToNodeParams(block);
  return {
    type: nodeType,
    params: params,
    attrs: {
      id: block.id
    }
  };
}

// Helper functions for content conversion
function blockContentToNode(content: any): any {
  if (typeof content === 'string') {
    return {
      type: "paragraph",
      content: [{ type: "text", text: content }]
    };
  } else if (content instanceof ParagraphBlock) {
    return {
      type: "paragraph",
      attrs: { id: content.id },
      content: content.content ? [{ type: "text", text: content.content }] : []
    };
  } else if (Array.isArray(content)) {
    return content.map(item => blockContentToNode(item));
  }
  return content;
}

function listItemToNode(item: ListItemBlock): Record<string, any> {
  let content = blockContentToNode(item.content);
  if (!Array.isArray(content)) {
    content = [content];
  }
  return {
    type: "listItem",
    attrs: { id: item.id },
    content: content
  };
}

function tableRowToNode(row: TableRowBlock): Record<string, any> {
  const cells = row.cells.map(cell => tableCellToNode(cell));
  return {
    type: "tableRow",
    attrs: { id: row.id },
    content: cells
  };
}

function tableCellToNode(cell: TableCellBlock | TableHeaderBlock): Record<string, any> {
  const content = blockContentToNode(cell.content);
  const nodeType = cell instanceof TableHeaderBlock ? "tableHeader" : "tableCell";
  const attrs: Record<string, any> = { id: cell.id };
  
  if (cell.colspan && cell.colspan > 1) {
    attrs.colspan = cell.colspan;
  }
  if (cell.rowspan && cell.rowspan > 1) {
    attrs.rowspan = cell.rowspan;
  }
  
  return {
    type: nodeType,
    attrs: attrs,
    content: Array.isArray(content) ? content : [content]
  };
}

function detailsSummaryToNode(summary: DetailsSummaryBlock): Record<string, any> {
  return {
    type: "detailsSummary",
    attrs: { id: summary.id },
    content: [{ type: "text", text: summary.text }]
  };
}

function detailsContentToNode(content: DetailsContentBlock): Record<string, any> {
  const nodeContent = content.content.map(item => blockContentToNode(item));
  return {
    type: "detailsContent",
    attrs: { id: content.id },
    content: nodeContent
  };
}

// Quick creation helpers
export function quickParagraph(text: string, referenceId?: string): CreateNodeOperation {
  const block = new ParagraphBlock(text);
  return createNodeOperation(block, referenceId);
}

export function quickHeading(level: number, text: string, referenceId?: string): CreateNodeOperation {
  const block = new HeadingBlock(level, text);
  return createNodeOperation(block, referenceId);
}

export function quickCodeBlock(code: string, language: string = "javascript", referenceId?: string): CreateNodeOperation {
  const block = new CustomCodeBlock(code, language);
  return createNodeOperation(block, referenceId);
}

export function quickImage(src: string, alt: string = "", referenceId?: string): CreateNodeOperation {
  const block = new ImageBlock(src, alt);
  return createNodeOperation(block, referenceId);
}

export function quickList(items: string[], ordered: boolean = false, referenceId?: string): CreateNodeOperation {
  const listItems = items.map(text => new ListItemBlock(text));
  const block = ordered 
    ? new OrderedListBlock(listItems)
    : new BulletListBlock(listItems);
  return createNodeOperation(block, referenceId);
}