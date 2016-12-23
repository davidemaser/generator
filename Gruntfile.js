module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today(\"yyyy-mm-dd\") %>*/\n',
        // Task configuration.
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            app: {
                src: 'src/generator.js',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: false,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: false,
                boss: false,
                eqnull: false,
                browser: true,
                globals: {
                    jQuery:true,
                    $: true,
                    _: true,
                    console:true,
                    core:true
                }
            },
            core: {
                src: ['src/*.js']
            }
        },
        concat: {
            basic: {
                src: ['node_modules/jquery/dist/jquery.min.js','dist/generator.min.js'],
                dest: 'dist/generator_package.js'
            }
        },
         watch: {
            scripts: {
                files: ['src/*.js','plugins/*.js','lib/*.js'],
                tasks: ['uglify','concat'],
                options: {
                    spawn: true,
                    event: ['added', 'changed'],
                    reload: true,
                    livereload: {
                        host: 'localhost',
                        port: 35729
                    }
                }
            }
        },
        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        'src/generator.js',
                        'dist/generator.min.js',
                        'dist/generator_package.js'
                    ]
                },
                options: {
                    port: 63342,
                    proxy: "localhost:63342/GENERATOR/demo.html"
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-install-dependencies');
    grunt.loadNpmTasks('grunt-browser-sync');


    // Default task.
    grunt.registerTask('default', ['jshint', 'uglify', 'concat', 'install-dependencies','watch']);
};