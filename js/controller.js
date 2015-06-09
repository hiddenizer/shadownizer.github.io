var rhasesQuestionsApp = angular.module('shadonizeApp', []);

rhasesQuestionsApp.controller('ShadonizeController', ['$scope', '$http', '$location', function($scope, $http, $location) {

	$scope.database = [];
	$scope.register = {};
	$scope.show_password_panel = true;
	$scope.new_register_panel = false;
	$scope.list_panel = false;

	$scope.password = '';
	$scope.confirmation = '';

	$scope.loadAndDecrypt = function() {
		password = $scope.password;
		confirmation = $scope.confirmation;
		if (password === '') {
			alert('Senha não pode ser em branco.');
			throw 'PasswordError';
		}
		if (password !== confirmation) {
			alert('Senha e confimação devem ser iguais.');
			throw 'PasswordError';
		}

		$scope.loadDatabase(function(success) {
			if (!success)
				throw 'Erro when system try load database.';

			$scope.show_password_panel = false;
			$scope.list_panel = true;
		});
	}

	$scope.encryptAndSave = function() {
		console.log("Encrypting registers...");
		encrypted = encrypt(JSON.stringify($scope.database), $scope.password);
		console.log("Register encrypted.");

		console.log("Uploading file 'pass.data' to Google Drive...");
		uploadFile(encrypted);
		console.log("File 'pass.data' uploaded to Google Drive...");
	}

	$scope.loadDatabase = function(callback) {
		//data = getFile();
		console.log("Downloading file 'pass.data' from Google Drive...");
		data  = downloadPassdataFile(function(data) {
			if (!data) {
				//insertFile('');
				console.log("Can not found 'pass.data'.");
				$scope.database = [];
				callback(true);
				return;
			}
			console.log("File 'pass.data' downloaded from Google Drive.");

			console.log("Decrypting file 'pass.data'...");
			$scope.database = decrypt(data, $scope.password);
			console.log("File 'pass.data' decrypted.");

			callback(true);
		});

	}

	$scope.addRegister = function() {
		// TODO: validar campos
		$scope.database.push($scope.register);
		$scope.register = {};
		$scope.new_register_panel = false;
		console.log("Registro salvo com sucesso.");
	}

}]);
