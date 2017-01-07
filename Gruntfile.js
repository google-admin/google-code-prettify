/**
 * google-code-prettify
 * https://github.com/google/code-prettify
 *
 * Copyright (C) 2017 Google Inc.
 * Licensed under Apache 2.0 license.
 */

module.exports = function (grunt) {
  'use strict';

  // project configuration
  grunt.initConfig({
    // metadata
    pkg: grunt.file.readJSON('package.json'),

    // grunt-preprocess
    preprocess: {
      // https://github.com/jsoverson/preprocess#optionstype
      options: {
        // renders @include directives (similar to SSI server-side includes)
        // where JS files are resolved relative to this directory
        srcDir: 'js-modules',
        type: 'js'
      },
      prettify: {
        src: 'js-modules/prettify.js',
        dest: 'src/prettify.js'
      },
      runprettify: {
        options: {
          context: {
            // to control where defs.js is included (top level)
            RUN_PRETTIFY: true
          }
        },
        src: 'js-modules/run_prettify.js',
        dest: 'src/run_prettify.js'
      }
    },

    // grunt-contrib-copy
    copy: {
      prettify: {
        options: {
          process: function (content) {
            // trim trailing whitespaces in blank lines added by preprocess
            return content.replace(/[ \f\t\v]+$/gm, '');
          }
        },
        files: [
          {src: 'src/prettify.js', dest: 'src/prettify.js'},
          {src: 'src/run_prettify.js', dest: 'src/run_prettify.js'}
        ]
      },
      langs: {
        options: {
          process: function (content) {
            // replace PR.PR_* token names with inlined strings
            return content
              .replace(/\bPR\.PR_ATTRIB_NAME\b/g,  '"atn"')
              .replace(/\bPR\.PR_ATTRIB_VALUE\b/g, '"atv"')
              .replace(/\bPR\.PR_COMMENT\b/g,      '"com"')
              .replace(/\bPR\.PR_DECLARATION\b/g,  '"dec"')
              .replace(/\bPR\.PR_KEYWORD\b/g,      '"kwd"')
              .replace(/\bPR\.PR_LITERAL\b/g,      '"lit"')
              .replace(/\bPR\.PR_NOCODE\b/g,       '"nocode"')
              .replace(/\bPR\.PR_PLAIN\b/g,        '"pln"')
              .replace(/\bPR\.PR_PUNCTUATION\b/g,  '"pun"')
              .replace(/\bPR\.PR_SOURCE\b/g,       '"src"')
              .replace(/\bPR\.PR_STRING\b/g,       '"str"')
              .replace(/\bPR\.PR_TAG\b/g,          '"tag"')
              .replace(/\bPR\.PR_TYPE\b/g,         '"typ"');
          }
        },
        files: [{
          expand: true,
          cwd: 'loader/',
          src: ['lang-*.js'],
          dest: 'loader/'
        }]
      }
    },

    // grunt-contrib-uglify
    uglify: {
      // https://github.com/mishoo/UglifyJS2#usage
      options: {
        report: 'gzip',
        ASCIIOnly: true,
        maxLineLen: 500,
        screwIE8: false
      },
      prettify: {
        options: {
          compress: {
            global_defs: {'IN_GLOBAL_SCOPE': true}
          },
          wrap: true
        },
        src: 'src/prettify.js',
        dest: 'loader/prettify.js'
      },
      runprettify: {
        options: {
          compress: {
            global_defs: {'IN_GLOBAL_SCOPE': false}
          },
          wrap: true
        },
        src: 'src/run_prettify.js',
        dest: 'loader/run_prettify.js'
      },
      langs: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['lang-*.js'],
          dest: 'loader/',
          ext: '.js'
        }]
      }
    },

    // grunt-contrib-cssmin
    cssmin: {
      // https://github.com/jakubpawlowicz/clean-css#how-to-use-clean-css-api
      options: {
        report: 'gzip'
      },
      prettify: {
        src: 'src/prettify.css',
        dest: 'loader/prettify.css'
      },
      skins: {
        files: [{
          expand: true,
          cwd: 'styles/',
          src: ['*.css'],
          dest: 'loader/skins/',
          ext: '.css'
        }]
      }
    }
  });

  // load plugins that provide tasks
  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // register task aliases
  grunt.registerTask('default', [
    'preprocess',
    'copy:prettify',
    'uglify',
    'copy:langs',
    'cssmin'
  ]);
};
