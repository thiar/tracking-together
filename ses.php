<!DOCTYPE html>
<html>
<head>
  <title>Mini GemasTIK</title>
  <link rel="shortcut icon" href="images/logoo.png">
  <link href="css/style.css" rel="stylesheet">
  <script src="js/jquery-1.11.2.js"></script>
  <script src="js/panel.js"></script>
</head>
<body>

	<div class="blok" id="panelKiri" style="border: 0px">
		<div class="blokPane">
			<ul>
				<li>
					<a href="assets/login.php">
						<i class="icon10"></i>
					</a>
				</li>
			</ul>
		</div>
	</div>

	<div class="fix" id="fixmenu">
		<div class="menu">
			<ul class="mcd-menu">
				<li style="float: right; width: 30%; margin-right: -13%;">
					<a href="index.html">
						<i class="logo1"></i>					
					</a>
				</li>
			</ul>
		</div>
	</div>
	<div class="container" style="margin-top: 50px; position: absolute">
        <div class="flat-form"> 
            <ul class="tabs">

                <li>
                    <a href="#login" class="active">Login</a>
                </li>
                <li style="float: right">
                    <a href="#register">Register</a>
                </li>
            </ul>
            <div id="login" class="form-action show">
                
                                <form action="assets/login.php" method="POST">
                    <ul>
                        <li>
                        	<label><img src="images/home.png"></label>
                            <input type="text" placeholder="Username" name="username" />
                        </li>
                        <li>
                            <label><img src="images/pass.png"></label>
                            <input type="password" placeholder="Password" name="password" />
                        </li>
                        <li>
                            <input type="submit" value="Login" class="button" />
                        </li>
                    </ul>
                </form>
                <h1 style="margin-top: 65px; text-align: center; margin-bottom: 20px"><img src="images/logoHov.png" style="height: 15px"></h1>
            </div>
            <!--/#login.form-action-->
            <div id="register" class="form-action hide">
                <form enctype='multipart/form-data' autocomplete="off" action="assets/inset_qu.php" method="POST">
                    <ul>
                        <li>
                        	<label>Nama Tim</label>
                        	<img src="images/home.png">
							<input type="text" placeholder="Team X" name="q1" required/>
                            <!-- <input type="text" placeholder="Username" /> -->
                        </li>
                        <li style="margin-top: 30px">
                        	<label>Email/No.Telp ketua (username)</label>
                        	<img src="images/home.png">
							<input type="text" placeholder="ketua@kelompok.com" name="q2" required/>
                            <!-- <input type="text" placeholder="Username" /> -->
                        </li>
                        <li style="margin-top: 30px">
                        	<label>Password</label>
                        	<img src="images/home.png">
							<input type="password" placeholder="password" name="pass" required/>
                            <!-- <input type="text" placeholder="Username" /> -->
                        </li>
                        <li style="margin-top: 30px">
                        	<label>Pilih Lomba</label>
                        	<label class="radio-cos">
  								<input type="radio" name="q3" value="game" />
  								<img src="images/game.png" style="margin-left: -20px;background: none; border-radius: 0em; width: 130px; height: auto">
							</label>
							<label class="radio-cos">
  								<input type="radio" name="q3" value="aplikasi" />
  								<img src="images/app.png" style="margin-left: 100px;background: none; border-radius: 0em; width: 130px; height: auto">
							</label>
							<label class="radio-cos">
  								<input type="radio" name="q3" value="security" />
  								<img src="images/jaringan.png" style="margin-left: 220px;background: none; border-radius: 0em; width: 130px; height: auto">
							</label>
                        </li>
                        <li style="margin-top: 190px">
                        	<label>Nama ketua</label>
                        	<img src="images/home.png">
							<input type="text" placeholder="Nama Ketua" name="q4"/>
							<input type="file" name="q5"/>
                        </li>
                        <li style="margin-top: 40px">
                        	<label>Nama Anggota 1</label>
                        	<img src="images/home.png">
							<input type="text" placeholder="Nama Anggota 1" name="q6"/>
							<input type="file" name="q7"/>
                        </li>
                        <li style="margin-top: 40px">
                        	<label>Nama Anggota 2</label>
                        	<img src="images/home.png">
							<input type="text" placeholder="Nama Anggota 2" name="q9" />
							<input type="file" name="q10"/>
                        </li>
                        <li>
                            <input type="submit" value="daftar" class="button" style="margin-top: 20px" />
                        </li>
                    </ul>
                </form>
                <h1 style="margin-top: 55px; text-align: center; margin-bottom: 20px"><img src="images/logoHov.png" style="height: 15px"></h1>
            </div>
        </div>
    </div>
    <script class="cssdeck" src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.8.0/jquery.min.js"></script>
	<script type="text/javascript">
	(function( $ ) {
	  var SHOW_CLASS = 'show',
	      HIDE_CLASS = 'hide',
	      ACTIVE_CLASS = 'active';
	  
	  $( '.tabs' ).on( 'click', 'li a', function(e){
	    e.preventDefault();
	    var $tab = $( this ),
	         href = $tab.attr( 'href' );
	  
	     $( '.active' ).removeClass( ACTIVE_CLASS );
	     $tab.addClass( ACTIVE_CLASS );
	  
	     $( '.show' )
	        .removeClass( SHOW_CLASS )
	        .addClass( HIDE_CLASS )
	        .hide();
	    
	      $(href)
	        .removeClass( HIDE_CLASS )
	        .addClass( SHOW_CLASS )
	        .hide()
	        .fadeIn( 550 );
	        if (href === "#register") {
	       		$('.flat-form').animate({height: '950px'}, 100);
	       	}
	       	else
	       	{
	       		$('.flat-form').animate({height: '340px'}, 100);	
	       	}
	  });
	})( jQuery );
	</script>

</body>

</html>