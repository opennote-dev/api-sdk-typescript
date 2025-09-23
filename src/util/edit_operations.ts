/**
 * Edit operation utilities for the Opennote Journal Editor API.
 * These functions provide a convenient way to create edit operations.
 */

import {
  BaseBlock,
  ParagraphBlock,
  HeadingBlock,
  CustomCodeBlock,
  ImageBlock,
  BulletListBlock,
  OrderedListBlock,
  ListItemBlock,
  Position
} from '../block_types';

import {
  CreateNodeOperation,
  UpdateNodeOperation,
  DeleteNodeOperation,
  EditOperation
} from '../api_types';

import { blockToNode } from '../block_type_converters';

/**
 * Create a block in the journal.
 * @param block The block to create
 * @param referenceId Optional ID of the node to insert relative to
 * @param position Position relative to reference node (default: AFTER)
 */
export function createBlock(
  block: BaseBlock,
  referenceId?: string,
  position: Position | string = Position.AFTER
): CreateNodeOperation {
  const node = blockToNode(block);
  
  return {
    type: "create_node",
    nodeType: node.type,
    params: node.params,
    referenceId: referenceId,
    position: typeof position === 'string' ? position as "before" | "after" : position as "before" | "after"
  };
}

/**
 * Update an existing block in the journal.
 * @param blockId The ID of the block to update
 * @param block The new block content
 */
export function updateBlock(
  blockId: string,
  block: BaseBlock
): UpdateNodeOperation {
  const node = blockToNode(block);
  return {
    type: "update_node",
    nodeId: blockId,
    node: node
  };
}

/**
 * Delete a block from the journal.
 * @param nodeId The ID of the node to delete
 */
export function deleteBlock(nodeId: string): DeleteNodeOperation {
  return {
    type: "delete_node",
    nodeId: nodeId
  };
}

// ===================================
// Quick creation helper functions
// ===================================

/**
 * Quickly create a paragraph operation.
 * @param text The paragraph text
 * @param referenceId Optional reference node ID
 */
export function makeParagraph(text: string, referenceId?: string): CreateNodeOperation {
  const block = new ParagraphBlock(text);
  return createBlock(block, referenceId);
}

/**
 * Quickly create a heading operation.
 * @param level The heading level (1-6)
 * @param text The heading text
 * @param referenceId Optional reference node ID
 */
export function makeHeading(level: number, text: string, referenceId?: string): CreateNodeOperation {
  const block = new HeadingBlock(level, text);
  return createBlock(block, referenceId);
}

/**
 * Quickly create a code block operation.
 * @param code The code content
 * @param language The programming language (default: "javascript")
 * @param referenceId Optional reference node ID
 */
export function makeCodeBlock(code: string, language: string = "javascript", referenceId?: string): CreateNodeOperation {
  const block = new CustomCodeBlock(code, language);
  return createBlock(block, referenceId);
}

/**
 * Quickly create an image operation.
 * @param src The image source URL
 * @param alt The alt text (default: "")
 * @param referenceId Optional reference node ID
 */
export function makeImage(src: string, alt: string = "", referenceId?: string): CreateNodeOperation {
  const block = new ImageBlock(src, alt);
  return createBlock(block, referenceId);
}

/**
 * Quickly create a list operation.
 * @param items Array of list item strings
 * @param ordered Whether to create an ordered list (default: false)
 * @param referenceId Optional reference node ID
 */
export function makeList(items: string[], ordered: boolean = false, referenceId?: string): CreateNodeOperation {
  const listItems = items.map(text => new ListItemBlock(text));
  const block = ordered 
    ? new OrderedListBlock(listItems)
    : new BulletListBlock(listItems);
  return createBlock(block, referenceId);
}