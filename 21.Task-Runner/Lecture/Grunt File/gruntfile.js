module.exports = function(grunt) {
    // Configure the tasks.
    grunt.initConfig({
        // Specify the tasks.
        uglify: {
            my_target: {
                files: {
                    'dest/js/output.min.js': ['src/js/index.js']
                }
            }
        },

        cssmin: {
            target: {
              files: [{
                expand: true,
                cwd: 'src/css',
                src: ['*.css', '!*.min.css'],
                dest: 'dest/css',
                ext: '.min.css'
              }]
            }
          }
    });

    // Load libraries
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-cssmin");

    // Setting up the tasks.
    grunt.registerTask("default", ["uglify", "cssmin"]);
}
