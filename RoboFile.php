<?php

/**
 * This is project's console commands configuration for Robo task runner.
 *
 * @see http://robo.li/
 */
class RoboFile extends \Robo\Tasks
{
    
    /**
     * This one must match docker containers suffix
     */
    private $project_suffix = 'fws';
    
    /**
     * Run app
     */
    public function up()
    {
        $this->taskExec('cd .. && docker-compose up')->run();
    }
    
    /**
     * Run arbitrary cli command
     */
    public function run(string $commands)
    {
        $this->taskExec('docker exec php-'.$this->project_suffix.' bash -c "cd /var/www/html/ && ' . $commands . '"')->run();
    }
    
    /**
     * Install app
     */
    public function install()
    {
        $this->artisan('key:generate');
      
        $this->composer('install');
        
        $this->migrate();
        $this->seed();
    }
    
    /**
     * Run migrations
     */
    public function migrate()
    {
        $this->taskExec('docker exec php-'.$this->project_suffix.' bash -c "cd /var/www/html/ && php artisan migrate"')->run();

        $this->say("Database tables created");
    }

    /**
     * Seed DB
     */
    public function seed($class = 'DatabaseSeeder')
    {

        $this->taskExec('docker exec composer-'.$this->project_suffix.' bash -c "composer dump-autoload"');
        $this->taskExec('docker exec php-'.$this->project_suffix.' bash -c "cd /var/www/html/ && php artisan db:seed --class ' . $class . '"')->run();
        $this->say("Database seeded");
    }
    
    /**
     * Use at your own risk
     * Drops all db tables
     */
    public function emptyDB()
    {
        $this->taskExec('docker exec -i php-'.$this->project_suffix.' bash -c "cd /var/www/html/ && php artisan droptables"')->run();
        
        $this->say("Database tables drop");
    }

    /**
     * Use at your own risk
     * Drops all db tables, runs migrations and fill in with Fake data
     */
    public function resetDB()
    {
        $this->emptyDB();
        $this->migrate();
        $this->seed();
        $this->artisan("passport:install"); // oauth keys
    }

    /**
     * Execute a composer command
     * You have to pass the command and arguments within quotes, like:
     * robo composer "require package/package"    
     *   
     * @param string $commands
     */
    public function composer(string $commands)
    {

        $this->taskExec('docker run --rm -v $(pwd):/app composer/composer ' . $commands)->run();
    }
    
    /**
     * Arguments must be wrapped altogether in quotes.     
     * 
     * @param string $commands Command within quotes
     * @param string $args Parameters after --
     */
    public function npm(string $commands, string $args = '')
    {
        // run docker as non-root user
        $this->taskExec('docker run --rm -v $(pwd):/app node bash -c "cd /usr/src/app/ && npm ' . $commands . '"')->args($args)->run();
    }

    /**
     * Launch unit testing
     * You can pass args like:
     * robo test -- --myarg 
     * 
     * @param string $args Anything after -- will be treated like args
     */
    public function test(string $args = '')
    {     
        $this->taskExec('docker-compose exec --user 1000 -T php bash -c "cd /var/www/html/ && vendor/bin/phpunit ' . $args . '"')->run();
    }

    /**
     * Arguments must be wrapped altogether in quotes. 
     * Eg: "make:test MyUnitest"
     * 
     * @param string $commands Command within quotes
     * @param string $args Parameters after --
     */
    public function artisan(string $commands, string $args = '')
    {
        // run docker as non-root user
        $this->taskExec('docker-compose exec --user 1000 -T php bash -c "cd /var/www/html/ && php artisan ' . $commands . '"')->args($args)->run();
    }

    /**
     * Watch logs in real time
     * tail -f log 
     */
    public function watchLog($filename = 'laravel')
    {
        $this->taskExec('tail -f storage/logs/'.$filename.'.log')->run();
    }
}
