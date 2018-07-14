/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { visit } from 'graphql'

/**
 * Converts an AST into a string, using one set of reasonable
 * formatting rules.
 */
export function print (ast) {
  return visit(ast, { leave: printDocASTReducer })
}

const printDocASTReducer = {
  Name: node => node.value,
  SelectionSet: ({ selections }) => block(selections),

  Field: ({ alias, name, arguments: args, directives, selectionSet }) =>
    join(
      [
        wrap('', alias, ': ') + name + wrap('(', join(args, ', '), ')'),
        join(directives, ' '),
        selectionSet
      ],
      ' '
    )
}

/**
 * Given maybeArray, print an empty string if it is null or empty, otherwise
 * print all items together separated by separator if provided
 */
function join (maybeArray, separator) {
  return maybeArray ? maybeArray.filter(x => x).join(separator || '') : ''
}

/**
 * Given array, print each item, wrapped in an "{ }" block.
 */
function block (array) {
  return array && array.length !== 0
    ? '{ ' + join(array, ' ') + ' }'
    : ''
}

/**
 * If maybeString is not null or empty, then wrap with start and end, otherwise
 * print an empty string.
 */
function wrap (start, maybeString, end) {
  return maybeString ? start + maybeString + (end || '') : ''
}
