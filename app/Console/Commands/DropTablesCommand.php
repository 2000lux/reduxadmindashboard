<?php
namespace App\Console\Commands;

use DB;
use Illuminate\Console\Command;

class DropTablesCommand extends Command
{

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'droptables';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Drops all DB tables (without asking for confirmation!)';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {

        // recursively drop tables
        while(count($droplist = $this->getTables()) > 0) {
            
            try {
                               
                $droplist = implode(',', $droplist);

                DB::beginTransaction();
                //turn off referential integrity
                //DB::statement('SET FOREIGN_KEY_CHECKS = 0');
                DB::statement("DROP TABLE $droplist");
                //turn referential integrity back on
                //DB::statement('SET FOREIGN_KEY_CHECKS = 1');
                DB::commit();
            } catch (\Illuminate\Database\QueryException $ex) {
                 $this->comment("Recursively deleting tables. Hold on.");
            }            
        } 
        
        $this->comment("Remaining tables count: " . count($droplist = $this->getTables()).PHP_EOL);
        
        $this->comment("** If no errors showed up, all tables were dropped".PHP_EOL);
    }
    
    private function getTables() 
    {
        $colname = 'Tables_in_' . env('DB_DATABASE');

        $tables = DB::select('SHOW TABLES');

        $droplist = [];
        foreach($tables as $table) {

            $droplist[] = $table->$colname;
        }
        
        return $droplist;
    }
}
