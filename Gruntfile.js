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
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery:true,
                    $: false,
                    Backbone: true,
                    Backgrid: true,
                    _: true,
                    console:true,
                    core:true
                }
            }
        },
         watch: {
            scripts: {
                files: ['src/*.js','plugins/*.js','lib/*.js'],
                options: {
                    spawn: true,
                    event: 'all'
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');


    // Default task.
    grunt.registerTask('default', ['uglify', 'watch']);
};