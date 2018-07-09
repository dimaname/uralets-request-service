<?php
//var_dump($_SERVER['REQUEST_METHOD'],$_SERVER['PATH_INFO']); die();
class PHP_API_AUTH {
	
	public function __construct($auth) {
		
		$this->auth = isset($auth)?$auth:null;
		$verb = isset($verb)?$verb:null;
		$path = isset($path)?$path:null;
		$username = isset($username)?$username:null;
		$password = isset($password)?$password:null;
		$token = isset($token)?$token:null;
	
		$method = isset($method)?$method:null;
		$request = isset($request)?$request:null;
		$post = isset($post)?$post:null;
		$origin = isset($origin)?$origin:null;
		
		$time = isset($time)?$time:null;
		$leeway = isset($leeway)?$leeway:null;
		$ttl = isset($ttl)?$ttl:null;
		$algorithm = isset($algorithm)?$algorithm:null;
		$secret = isset($secret)?$secret:null;
		$allow_origin = isset($allow_origin)?$allow_origin:null;
		// defaults
		if (!$verb) {
			$verb = 'POST';
		}
		if (!$path) {
			$path = '';
		}
		if (!$username) {
			$username = 'username';
		}
		if (!$password) {
			$password = 'password';
		}
		if (!$token) {
			$token = 'token';
		}
		
		if (!$method) {
			$method = $_SERVER['REQUEST_METHOD'];
		}
		if (!$request) {
			$request = isset($_SERVER['PATH_INFO'])?$_SERVER['PATH_INFO']:'';
			if (!$request) {
				$request = isset($_SERVER['ORIG_PATH_INFO'])?$_SERVER['ORIG_PATH_INFO']:'';
			}
		}
		if (!$post) {
			$post = 'php://input';
		}
		if (!$origin) {
			$origin = isset($_SERVER['HTTP_ORIGIN'])?$_SERVER['HTTP_ORIGIN']:'';
		}
		if (!$time) {
			$time = time();
		}
		if (!$leeway) {
			$leeway = 5;
		}
		if (!$ttl) {
			$ttl = 30;
		}
		if (!$algorithm) {
			$algorithm = 'HS256';
		}
		if ($allow_origin===null) {
			$allow_origin = '*';
		}
		$request = trim($request,'/');
		
		$this->settings = compact('verb', 'path', 'username', 'password', 'token', 'authenticator', 'method', 'request', 'post', 'origin', 'time', 'leeway', 'ttl', 'algorithm', 'secret', 'allow_origin');
	}
	protected function retrieveInput($post) {
		$input = (object)array();
		$data = trim(file_get_contents($post));
		if (strlen($data)>0) {
			if ($data[0]=='{') {
				$input = json_decode($data);
			} else {
				parse_str($data, $input);
				$input = (object)$input;
			}
		}
		return $input;
	}

	protected function allowOrigin($origin,$allowOrigins) {
		if (isset($_SERVER['REQUEST_METHOD'])) {
			header('Access-Control-Allow-Credentials: true');			
			foreach (explode(',',$allowOrigins) as $o) {
				if (preg_match('/^'.str_replace('\*','.*',preg_quote(strtolower(trim($o)))).'$/',$origin)) { 
					header('Access-Control-Allow-Origin: '.$origin);
					break;
				}
			}
		}
	}
	protected function headersCommand() {
		$headers = array();
		$headers[]='Access-Control-Allow-Headers: Content-Type';
		$headers[]='Access-Control-Allow-Methods: OPTIONS, GET, PUT, POST, DELETE, PATCH';
		$headers[]='Access-Control-Allow-Credentials: true';
		$headers[]='Access-Control-Max-Age: 1728000';
		if (isset($_SERVER['REQUEST_METHOD'])) {
			foreach ($headers as $header) header($header);
		} else {
			echo json_encode($headers);
		}
	}

	public function executeCommand() {
		extract($this->settings);
		if ($origin) {
			$this->allowOrigin($origin,$allow_origin);
		}
		if ($method=='OPTIONS') {
			$this->headersCommand();
			return true;
		}
	
		if ($method==$verb && trim($path,'/')==$request) {
			$input = $this->retrieveInput($post);
			$auth = $this->auth;
			if (isset($input->$username) && isset($input->$password)) {
				try {
					$rememberDuration = (int) (60 * 60 * 24 * 365.25);
					$auth->loginWithUsername($input->$username, $input->$password,  $rememberDuration );
					$app = array();
					$app['user'] = null;
					$userData['id'] = $auth->getUserId();
					$userData['username'] = $auth->getUsername(); 
					$userData['isAdmin'] = $auth->admin()->doesUserHaveRole($auth->getUserId(), \Delight\Auth\Role::ADMIN);					
					echo json_encode($userData);
					
				}
				catch (\Delight\Auth\InvalidEmailException $e) {
					$responce = array('type'=>'error');
					$responce['message'] = 'InvalidEmailException';
					echo json_encode($responce);
					$auth->logOutAndDestroySession(); 
				}catch (\Delight\Auth\UnknownUsernameException $e) {
					$responce = array('type'=>'error');
					$responce['message'] = 'UnknownUsernameException';
					echo json_encode($responce);
					$auth->logOutAndDestroySession();
				}
				catch (\Delight\Auth\InvalidPasswordException $e) {
					$responce = array('type'=>'error');
					$responce['message'] = 'InvalidPasswordException';
					echo json_encode($responce);
					$auth->logOutAndDestroySession();
				}
				catch (\Delight\Auth\EmailNotVerifiedException $e) {
					$responce = array('type'=>'error');
					$responce['message'] = 'EmailNotVerifiedException';
					echo json_encode($responce);
					$auth->logOutAndDestroySession();
				}
				catch (\Delight\Auth\TooManyRequestsException $e) {
					$responce = array('type'=>'error');
					$responce['message'] = 'TooManyRequestsException';
					echo json_encode($responce);
				    $auth->logOutAndDestroySession();
				}			
			} else {
				$auth->logOutAndDestroySession();
			}
			return true;
		}else if($method=='GET' && 'app' == $request){
			$auth = $this->auth;
			$app = array();
			$app['user'] = null;

			if ($auth->isLoggedIn() && $auth->isNormal() ){
			    $userData = array();
				$userData['id'] = $auth->getUserId();
				$userData['username'] = $auth->getUsername();   
				$userData['isAdmin'] = $auth->admin()->doesUserHaveRole($auth->getUserId(), \Delight\Auth\Role::ADMIN);					
				$app['user'] = $userData;
			}
			
			echo json_encode($app);
			return true;
		}else if($method=='GET' && 'logout' == $request){
			$auth = $this->auth;
			$auth->logOutAndDestroySession();
			return true;
		}else if($method=='POST' && 'requestBlank' == $request){
			$auth = $this->auth;
			$responce = array(); 
			$isError = false;
			$errorText = '';
			if ( true || $auth->isLoggedIn() && $auth->isNormal() ){
			
				$blankData = $this->retrieveInput($post)->requestData;	
				$docPath = printDoc($blankData);
				
				if(!$docPath){
					$isError = true;
					$errorText = 'print error';	
				}else{
					$mailInfo = sendFileToMail($blankData, $docPath);					
					
					if($mailInfo !== TRUE){					
						$isError = true;
						$errorText = 'mail error: '.$mailInfo;	
					}	
					unlink($docPath);
				}
			}else{
				$isError = true;
				$errorText = 'auth error';	
			}
			$responce['status'] = $isError ? 'error' : 'ok';
			$responce['statusMessage'] = $errorText ? $errorText : 'request is ok';
		
			echo json_encode($responce);
			return true;
		}
		return false;
	}
}



function printDoc($blankData){	
	if(!is_array($blankData->selectedPupils) )
		return false;

	$templateProcessor = new \PhpOffice\PhpWord\TemplateProcessor('docs/Template.docx');
	$index = 1;	
	$dataLength = count($blankData->selectedPupils);	
	$templateProcessor->cloneRow('rowNumber', $dataLength);

	foreach($blankData->selectedPupils as $row){
		if(!isset($row->fio)) return;
		$rowNumber = $index;
		$rowFIO = $row->fio;
		$rowBirthday = isset($row->birthday) ? $row->birthday : '';
		$rowWeight = isset($row->weight) ? $row->weight: '';
		$rowLevel = isset($row->level) ? $row->level: '';
		$rowTrainerFIO = isset($row->trainerFio) ? $row->trainerFio: '';
	
		$templateProcessor->setValue('rowNumber#'.$index, $rowNumber);
		$templateProcessor->setValue('rowFIO#'.$index, $rowFIO);
		$templateProcessor->setValue('rowBirthday#'.$index, $rowBirthday);
		$templateProcessor->setValue('rowWeight#'.$index, $rowWeight);
		$templateProcessor->setValue('rowLevel#'.$index, $rowLevel);
		$templateProcessor->setValue('rowTrainerFIO#'.$index, $rowTrainerFIO);
		
		$index++;
	}
	
	$competitionTitle = $blankData->competitionTitle;
	$templateProcessor->setValue('shortTitle', $competitionTitle);
	
	
	$filePath = 'docs/printed/Заявка_'.date("d_m_Y__H_i_s").'.docx';
	$templateProcessor->saveAs($filePath );	
	return $filePath ;

}

function sendFileToMail($blankData, $filepath){
	
	if (!file_exists($filepath)) {
		$errorText = "file not found ".$filepath;
		logger($errorText);
		return $errorText;
	} 

	$mail = new PHPMailer\PHPMailer\PHPMailer(true);                            
	try {
		$competitionTitle = $blankData->competitionTitle;   
		//Server settings	      
			
		$mail->CharSet = 'UTF-8';
		$mail->setLanguage('ru');			
		$mail->isSMTP();  //      $mail->isMail();                      // Set mailer to use SMTP
		$mail->Host = 'server138.hosting.reg.ru';             // Specify main and backup SMTP servers
		$mail->SMTPAuth = true;                     // Enable SMTP authentication
		$mail->Username = 'admin@scuralets.ru';          // SMTP username
		$mail->Password = ''; // SMTP password
		$mail->SMTPSecure = 'tls';                  // Enable TLS encryption, `ssl` also accepted
		$mail->Port = 587;        
				
	  
		//Recipients
		$mail->setFrom('admin@scuralets.ru', 'Administrator');
		$mail->addAddress('judamigo@yandex.ru');     
		$mail->addAddress('dimaname@gmail.com');     
        $mail->Subject = "Заявка на соревнование";
        $mail->Body   = "Название соревнования: ".$competitionTitle;
        $mail->AddAttachment( $filepath, 'Заявка_'.$competitionTitle.'.docx' );        
        $mail->Send();
		
		logger('mail was sent:Заявка_'.$competitionTitle.'.docx');
		
		return true;
	
	} catch (Exception $e) {
		$errorText = 'Message could not be sent. Mailer Error: '. $mail->ErrorInfo;
		logger($errorText);
		return $errorText;
	}
	
}

function logger($txt){	
    $txt = date('Y.m.d H:i:s ', time()).$txt.PHP_EOL;
	$logFile = fopen("logs.txt", "a");		
	fwrite($logFile, $txt);
	fclose($logFile);	
}
?>