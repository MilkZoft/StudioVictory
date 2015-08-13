'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-githooks');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadTasks('grunt');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      all: {
        src: 'dist'
      },
    },
    copy: {
      all: {
        expand: true,
        cwd: '',
        src: [
          '.jshintrc',
          '.jscsrc',
          '.bowerrc',
          '*.*',
          './bin/**/*',
          './node_modules/**/*',
          './src/**/*',
          './grunt/**/*',
          './logs/**/*'
        ],
        dest: 'dist'
      }
    },
    jscs: {
      options: {
        config: '.jscsrc',
        reporter: 'checkstyle'
      },
      src: [
        'Gruntfile.js',
        'grunt/**/*.js',
        'src/**/*.js',
        'test/**/*.js',
        '!src/public/bower_components/**'
      ]
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: 'checkstyle'
      },
      src: [
        'Gruntfile.js',
        'grunt/**/*.js',
        'src/**/*.js',
        'test/**/*.js',
        '!src/public/bower_components/**'
      ]
    },
    githooks: {
      all: {
        options: {
            endMarker: ''
        },
        'pre-commit': 'analyze',
        'pre-push': 'test',
        'post-checkout': 'shell:gitLog',
        'post-commit': 'shell:gitLog',
        'post-merge': 'shell:gitLog shell:npmInstall'
      }
    },
    shell: {
      gitLog: {
        command: 'git log -1 > git-info.txt'
      },
      npmInstall: {
        command: 'npm install'
      },
      vagrantLogs:  {
        command: 'vagrant ssh -c "cd /vagrant && pm2 logs"'
      },
      vagrantStatus: {
        command: 'vagrant ssh -c "cd /vagrant && pm2 list"'
      },
      vagrantStop: {
        command: 'vagrant ssh -c "cd /vagrant && pm2 kill"'
      },
      vagrantDelete: {
        command: 'vagrant ssh -c "cd /vagrant && pm2 delete pm2.json"'
      },
      vagrantStart: {
        command: 'vagrant ssh -c "cd /vagrant && pm2 start pm2.json"'
      },
      vagrantStartDist: {
        command: 'vagrant ssh -c "cd /vagrant/dist && pm2 start pm2.json"'
      }
    },
    mochaTest: {
      all: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*Test.js', '!test/public/js/**/*Test.js']
      }
    },
    karma: {
      client: {
        configFile: 'karma.conf.js'
      }
    },
    stylus: {
      compile: {
        options: {
          compress: true,
          paths: ['source/stylus']
        },
        files: {
          'public/css/style.css': 'public/stylus/style.styl'
        }
      }
    },
    autoprefixer: {
      compile: {
        files: {
          'public/css/style.css': 'public/css/style.css'
        },
      },
    }
  });

  grunt.registerTask('default', ['test']);
  grunt.registerTask('test', 'Runs unit tests', ['mochaTest', 'karma:client']);
  grunt.registerTask('analyze', 'Validates code style', ['jshint', 'jscs']);
  grunt.registerTask('deploy', 'Deploys code', ['clean', 'copy', 'stylus']);
};
