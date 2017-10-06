<?php
namespace App;

use PhpOffice\PhpSpreadsheet\Reader\Xlsx;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx as Xlsx2;

class QuotationShipmentCalculator
{

    /*
     * Loaded xlsx file
     */
    private $spreadsheet; 
    
    /**
     * May be a template or generated file. But without extension.
     */
    private $shipment_type;
    
    /**
     * May be a template or generated file. But without extension.
     */
    private $filename;

    /**
     * Map of field names and xlsx cells
     * @var array 
     */
    private $xlsx_field_map;
    
    private $templates_folder;
    private $generated_files_folder;
    
    function __construct(string $shipment_type)
    {
        $this->shipment_type = $shipment_type;
        
        // read xls cells map from config
        $this->xlsx_field_map = config('app.xlsx_field_map');    
        
        // templates fodler
        $templates_path = config('filesystems.resources.xlsx-templates');
        $this->templates_folder = resource_path($templates_path);
        
        // generated files folder
        $xlsx_files_path = config('filesystems.storage.public.xlsx-files');
        $this->generated_files_folder = storage_path("app/public/".$xlsx_files_path);
    }
    
    /**
     * 
     * @param string $name without extension
     */
    public function loadTemplate(string $name = null)
    {        
        $name = $name ?: $this->shipment_type;                       
        
        $reader = new Xlsx();
        $this->spreadsheet = $reader->load($this->templates_folder . "/" . $name . ".xlsx");
    }
    
    /**
     * 
     * @param string $name without extension
     */
    public function loadFile(string $name)
    {        
        $this->filename = $name;
        
        $reader = new Xlsx();
        $this->spreadsheet = $reader->load($this->generated_files_folder . "/" . $name . ".xlsx");
    }

    /**
     * Maps field names to excel cells
     * @param type $fields
     */
    public function mapFields(array $fields) 
    {
        $sheet = $this->spreadsheet->getActiveSheet();
        
        foreach($fields as $field => $value) {
            $cell = $this->xlsx_field_map[$this->shipment_type][$field];
            $sheet->setCellValue($cell, $value);
        }
    }
    
    public function readResult()
    {
        $sheet = $this->spreadsheet->getActiveSheet();
        return $sheet->getCell($this->xlsx_field_map[$this->shipment_type]['result'])->getCalculatedValue();
    }
    
    /**
     * Save to disk 
     * @param type $name
     * @return type
     */
    public function save(string $name)
    {
        $writer = new Xlsx2($this->spreadsheet);
        
        return $writer->save($this->generated_files_folder. "/" . $name . ".xlsx");
    }
    
    public function getLink($file_name) 
    {
        $xlsx_files_path = config('filesystems.storage.public.xlsx-files');
        return \Illuminate\Support\Facades\Storage::url($xlsx_files_path. "/" . $file_name.".xlsx");
    }
}
