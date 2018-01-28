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
			if ($auth->isLoggedIn() && $auth->isNormal() ){
				$responce['requestBlankData'] = $_POST;
				$responce['status'] = 'ok';	
			}else{
				$responce['status'] = 'error';
			}
		
			echo json_encode($responce);
			return true;
		}
		return false;
	}
}