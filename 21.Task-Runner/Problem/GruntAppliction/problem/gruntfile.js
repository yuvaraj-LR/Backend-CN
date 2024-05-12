module.exports = function (grunt) {
    grunt.initConfig({
        replace: {
            dist: {
                options: {
                    replace: [
                        {
                            match: "ninjacoding.com",
                            replacement: "codingninjas.com"
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: ['src/index.html'],
                        dest: 'build/'
                    }
                ]
            }
        }
    });

    grunt.loadNpmTasks('grunt-replace'); // Load the grunt-replace task

    // Default task: replace text in HTML files
    grunt.registerTask('default', ['replace']);
};
